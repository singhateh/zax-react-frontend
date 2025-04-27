import InputField from '../../../../components/InputField';

export const PasswordEditForm = ({ form, loading, onChange, errors = {} }) => {

    const passwordsMatch = form.new_password === form.confirm_password;

    return (
        <div>
            <div>
                <InputField
                    label="Current Password"
                    type="password"
                    name="current_password"
                    value={form.current_password}
                    onChange={onChange}
                    disabled={loading}
                    errors={errors}
                />
            </div>
            <div>
                <InputField
                    label="New Password"
                    type="password"
                    name="new_password"
                    value={form.new_password}
                    onChange={onChange}
                    disabled={loading}
                    errors={errors}
                />
            </div>
            <div>
                <InputField
                    label="Confirm New Password"
                    type="password"
                    name="confirm_password"
                    value={form.confirm_password}
                    onChange={onChange}
                    disabled={loading}
                    errors={errors}

                />
                {!passwordsMatch && form.confirm_password && (
                    <p className="text-red-500 text-sm mt-1">
                        New password and confirm password do not match.
                    </p>
                )}
            </div>
        </div>
    );
};
