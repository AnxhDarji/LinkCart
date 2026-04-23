import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Bell, Shield, User, UserCircle, Trash2, Camera } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../utils/api';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import SettingsLayout from '../components/settings/SettingsLayout';
import SettingsSidebar from '../components/settings/SettingsSidebar';
import SettingsForm from '../components/settings/SettingsForm';
import SettingsInputField from '../components/settings/SettingsInputField';
import SettingsTextArea from '../components/settings/SettingsTextArea';
import ToggleSwitch from '../components/settings/ToggleSwitch';
import UserAvatar from '../components/UserAvatar';

const TABS = [
    { key: 'account', label: 'Account', icon: User },
    { key: 'profile', label: 'Profile', icon: UserCircle },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'notifications', label: 'Notifications', icon: Bell },
];

const primaryBtn =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-px active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';

const dangerBtn =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

const cardSubtle =
    'bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-6 md:p-8 shadow-[0_8px_40px_rgba(99,102,241,0.10)]';

const readToken = () => localStorage.getItem('token') || '';

const Settings = () => {
    const { isLoggedIn, currentUser, profileLoading, refreshCurrentUser, updateCurrentUser } = useAppContext();
    const toast = useToast();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = useMemo(() => {
        const key = (searchParams.get('tab') || 'account').toLowerCase();
        return TABS.some((t) => t.key === key) ? key : 'account';
    }, [searchParams]);

    const setTab = (key) => setSearchParams({ tab: key });

    const [accountForm, setAccountForm] = useState({ fullName: '', email: '', phone: '' });
    const [profileForm, setProfileForm] = useState({ bio: '', city: '', state: '' });
    const [notifForm, setNotifForm] = useState({
        emailNotifications: true,
        interestAlerts: true,
        productUpdates: false,
    });

    const [accountSaving, setAccountSaving] = useState(false);
    const [profileSaving, setProfileSaving] = useState(false);
    const [uploadingPic, setUploadingPic] = useState(false);

    const [errors, setErrors] = useState({});

    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) return;
        if (!currentUser && !profileLoading) {
            refreshCurrentUser();
        }
    }, [isLoggedIn, currentUser, profileLoading, refreshCurrentUser]);

    useEffect(() => {
        if (!currentUser) return;
        setAccountForm({
            fullName: currentUser.full_name || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
        });
        setProfileForm({
            bio: currentUser.tagline || '',
            city: currentUser.city || '',
            state: currentUser.state || '',
        });
    }, [currentUser]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('settings.notifications');
            if (!stored) return;
            const parsed = JSON.parse(stored);
            setNotifForm((prev) => ({ ...prev, ...parsed }));
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('settings.notifications', JSON.stringify(notifForm));
    }, [notifForm]);

    const validateAccount = () => {
        const nextErrors = {};
        if (!accountForm.fullName.trim()) nextErrors.fullName = 'Full name is required.';

        const phone = String(accountForm.phone || '').trim();
        if (phone && !/^[6-9][0-9]{9}$/.test(phone)) {
            nextErrors.phone = 'Enter a valid 10-digit mobile number.';
        }

        setErrors((prev) => ({ ...prev, ...nextErrors }));
        return Object.keys(nextErrors).length === 0;
    };

    const validateProfile = () => {
        const nextErrors = {};
        if (String(profileForm.bio || '').length > 50) nextErrors.bio = 'Bio must be 50 characters or fewer.';
        setErrors((prev) => ({ ...prev, ...nextErrors }));
        return Object.keys(nextErrors).length === 0;
    };

    const authFetch = async (url, options = {}) => {
        const token = readToken();
        return fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
            },
        });
    };

    const handleSaveAccount = async () => {
        setErrors({});
        if (!validateAccount()) return;

        const token = readToken();
        if (!token) {
            toast.error('Please sign in to update settings.');
            navigate('/login');
            return;
        }

        setAccountSaving(true);
        try {
            const res = await authFetch(`${API_BASE}/api/users/update-profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: accountForm.fullName,
                    phone: String(accountForm.phone || '').trim(),
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Failed to save changes.');
                return;
            }

            updateCurrentUser(data.user || {});
            toast.success('Account settings saved.');
        } catch {
            toast.error('Server error. Please try again later.');
        } finally {
            setAccountSaving(false);
        }
    };

    const handleSaveProfile = async () => {
        setErrors({});
        if (!validateProfile()) return;

        const token = readToken();
        if (!token) {
            toast.error('Please sign in to update settings.');
            navigate('/login');
            return;
        }

        setProfileSaving(true);
        try {
            // 1) Update "Bio" -> users.tagline (existing API)
            const res1 = await authFetch(`${API_BASE}/api/users/update-profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tagline: profileForm.bio }),
            });
            const data1 = await res1.json();
            if (!res1.ok) {
                toast.error(data1.error || 'Failed to save profile.');
                return;
            }
            updateCurrentUser(data1.user || {});

            // 2) Update city/state via existing profile API (preserve other fields)
            const payload = {
                phone: (currentUser?.phone ?? '').toString(),
                address: currentUser?.address ?? '',
                city: profileForm.city,
                state: profileForm.state,
                pincode: (currentUser?.pincode ?? '').toString(),
            };

            const res2 = await authFetch(`${API_BASE}/api/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res2.ok) {
                // Keep UX safe: bio was saved, but city/state might not be.
                toast.warning('Bio saved. Location update is unavailable right now.');
                return;
            }

            await refreshCurrentUser();
            toast.success('Profile settings saved.');
        } catch {
            toast.error('Server error. Please try again later.');
        } finally {
            setProfileSaving(false);
        }
    };

    const handleUploadPic = async (file) => {
        if (!file) return;
        const token = readToken();
        if (!token) {
            toast.error('Please sign in to update settings.');
            navigate('/login');
            return;
        }

        setUploadingPic(true);
        try {
            const fd = new FormData();
            fd.append('image', file);

            const res = await authFetch(`${API_BASE}/api/users/upload-profile-pic`, {
                method: 'POST',
                body: fd,
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Failed to upload picture.');
                return;
            }

            updateCurrentUser(data.user || {});
            toast.success('Profile picture updated.');
        } catch {
            toast.error('Server error. Please try again later.');
        } finally {
            setUploadingPic(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <>
                <Navbar />
                <SettingsLayout title="Settings" subtitle="Manage your account preferences.">
                    <div className={cardSubtle}>
                        <p className="text-slate-700 font-medium">You need to be signed in to access settings.</p>
                        <div className="mt-5 flex items-center gap-3">
                            <button className={primaryBtn} type="button" onClick={() => navigate('/login')}>
                                Go to Login
                            </button>
                            <Link className="text-sm text-indigo-600 font-semibold hover:text-indigo-700" to="/signup">
                                Create an account
                            </Link>
                        </div>
                    </div>
                </SettingsLayout>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <SettingsLayout title="Settings" subtitle="Keep your account details and preferences up to date.">
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
                    <SettingsSidebar tabs={TABS} activeKey={activeTab} onChange={setTab} />

                    <div className="space-y-6">
                        {activeTab === 'account' ? (
                            <SettingsForm
                                title="Account"
                                description="Update your basic account details."
                                footer={
                                    <div className="flex items-center justify-end">
                                        <button type="button" className={primaryBtn} onClick={handleSaveAccount} disabled={accountSaving}>
                                            {accountSaving ? 'Saving…' : 'Save Changes'}
                                        </button>
                                    </div>
                                }
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <SettingsInputField
                                        label="Full Name"
                                        name="fullName"
                                        value={accountForm.fullName}
                                        onChange={(e) => {
                                            setAccountForm((p) => ({ ...p, fullName: e.target.value }));
                                            if (errors.fullName) setErrors((p) => ({ ...p, fullName: '' }));
                                        }}
                                        placeholder="Your full name"
                                        error={errors.fullName}
                                        autoComplete="name"
                                    />
                                    <SettingsInputField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={accountForm.email}
                                        onChange={() => {}}
                                        readOnly
                                        helper="Email changes are currently not supported."
                                        autoComplete="email"
                                    />
                                </div>

                                <SettingsInputField
                                    label="Phone"
                                    name="phone"
                                    value={accountForm.phone}
                                    onChange={(e) => {
                                        setAccountForm((p) => ({ ...p, phone: e.target.value }));
                                        if (errors.phone) setErrors((p) => ({ ...p, phone: '' }));
                                    }}
                                    placeholder="10-digit mobile number"
                                    error={errors.phone}
                                    autoComplete="tel"
                                />
                            </SettingsForm>
                        ) : null}

                        {activeTab === 'profile' ? (
                            <SettingsForm
                                title="Profile"
                                description="Personalize how you appear to others."
                                footer={
                                    <div className="flex items-center justify-end">
                                        <button type="button" className={primaryBtn} onClick={handleSaveProfile} disabled={profileSaving}>
                                            {profileSaving ? 'Saving…' : 'Save Changes'}
                                        </button>
                                    </div>
                                }
                            >
                                <div className="flex items-center gap-5">
                                    <UserAvatar user={currentUser} size="md" className="border-2 border-white shadow-md" />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-800">Profile Picture</p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Upload a clear photo to help others recognize you.
                                        </p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <label
                                                className={`${primaryBtn} w-auto px-4 py-2.5 cursor-pointer ${uploadingPic ? 'pointer-events-none' : ''}`}
                                            >
                                                <Camera size={16} />
                                                {uploadingPic ? 'Uploading…' : 'Upload'}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleUploadPic(e.target.files?.[0])}
                                                />
                                            </label>
                                            <p className="text-xs text-slate-500">JPG/PNG/WEBP</p>
                                        </div>
                                    </div>
                                </div>

                                <SettingsTextArea
                                    label="Bio"
                                    name="bio"
                                    value={profileForm.bio}
                                    onChange={(e) => {
                                        setProfileForm((p) => ({ ...p, bio: e.target.value }));
                                        if (errors.bio) setErrors((p) => ({ ...p, bio: '' }));
                                    }}
                                    placeholder="A short bio (max 50 characters)"
                                    helper="This shows up on your profile."
                                    maxLength={50}
                                    error={errors.bio}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <SettingsInputField
                                        label="City"
                                        name="city"
                                        value={profileForm.city}
                                        onChange={(e) => setProfileForm((p) => ({ ...p, city: e.target.value }))}
                                        placeholder="e.g. Ahmedabad"
                                    />
                                    <SettingsInputField
                                        label="State"
                                        name="state"
                                        value={profileForm.state}
                                        onChange={(e) => setProfileForm((p) => ({ ...p, state: e.target.value }))}
                                        placeholder="e.g. Gujarat"
                                    />
                                </div>
                            </SettingsForm>
                        ) : null}

                        {activeTab === 'security' ? (
                            <SettingsForm
                                title="Security"
                                description="Manage password and account security."
                                footer={
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm text-indigo-600 font-semibold hover:text-indigo-700"
                                        >
                                            Forgot your password?
                                        </Link>
                                        <button
                                            type="button"
                                            className={primaryBtn}
                                            onClick={() => toast.info('Password change is not available yet. Use Forgot Password.')}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                }
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <SettingsInputField
                                        label="Current Password"
                                        name="currentPassword"
                                        type="password"
                                        value=""
                                        onChange={() => {}}
                                        disabled
                                        helper="Coming soon"
                                        autoComplete="current-password"
                                    />
                                    <div />
                                    <SettingsInputField
                                        label="New Password"
                                        name="newPassword"
                                        type="password"
                                        value=""
                                        onChange={() => {}}
                                        disabled
                                        helper="Coming soon"
                                        autoComplete="new-password"
                                    />
                                    <SettingsInputField
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type="password"
                                        value=""
                                        onChange={() => {}}
                                        disabled
                                        helper="Coming soon"
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm font-semibold text-slate-800">Tip</p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        To change your password today, use the OTP-based reset flow.
                                    </p>
                                </div>
                            </SettingsForm>
                        ) : null}

                        {activeTab === 'notifications' ? (
                            <SettingsForm
                                title="Notifications"
                                description="Choose what you want to be notified about."
                                footer={
                                    <div className="flex items-center justify-end">
                                        <button
                                            type="button"
                                            className={primaryBtn}
                                            onClick={() => toast.success('Notification preferences saved.')}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                }
                            >
                                <div className="space-y-5">
                                    <ToggleSwitch
                                        label="Email Notifications"
                                        description="Product updates and important account messages."
                                        checked={!!notifForm.emailNotifications}
                                        onChange={(next) => setNotifForm((p) => ({ ...p, emailNotifications: next }))}
                                    />
                                    <div className="border-t border-slate-100" />
                                    <ToggleSwitch
                                        label="Interest Alerts"
                                        description="Get notified when someone shows interest in your listings."
                                        checked={!!notifForm.interestAlerts}
                                        onChange={(next) => setNotifForm((p) => ({ ...p, interestAlerts: next }))}
                                    />
                                    <div className="border-t border-slate-100" />
                                    <ToggleSwitch
                                        label="Product Updates"
                                        description="New features, improvements, and announcements."
                                        checked={!!notifForm.productUpdates}
                                        onChange={(next) => setNotifForm((p) => ({ ...p, productUpdates: next }))}
                                    />
                                </div>
                            </SettingsForm>
                        ) : null}

                        {/* Danger Zone */}
                        <div className="bg-white/80 backdrop-blur-xl border border-red-100 rounded-2xl p-6 md:p-8 shadow-[0_8px_40px_rgba(239,68,68,0.08)]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">Danger Zone</h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Deleting your account is irreversible. This is UI-only right now.
                                    </p>
                                </div>
                                <button type="button" className={dangerBtn} onClick={() => setDeleteOpen(true)}>
                                    <Trash2 size={16} />Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirmation Modal */}
                {deleteOpen ? (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                        <div
                            className="absolute inset-0 bg-slate-900/40"
                            onClick={() => setDeleteOpen(false)}
                            aria-hidden="true"
                        />
                        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
                            <h4 className="text-lg font-semibold text-slate-800">Delete account?</h4>
                            <p className="mt-2 text-sm text-slate-600">
                                Are you sure you want to delete your account? This action can’t be undone.
                            </p>

                            <div className="mt-6 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                                    onClick={() => setDeleteOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className={dangerBtn}
                                    onClick={() => {
                                        setDeleteOpen(false);
                                        toast.warning('Account deletion is not available yet.');
                                    }}
                                >
                                    Yes, delete
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </SettingsLayout>

            <Footer />
        </>
    );
};

export default Settings;

