export const AccountStatuses = {
    /** Used when a User registers their account and still needs to validate their e-mail address. */
    PENDING_VERIFICATION: 'Pending Email Verification',

    /** Used when a User validated their e-mail address and can be used normally. */
    ACTIVE: 'Active',

    /**
     * Used when a User has attempted too many log in (or similar activities) attempts.
     * Is reverted back to {@link AccountStatuses.ACTIVE} after the timeout has been lifted.
     */
    LOCKED: 'Locked',

    /**
     * Used when a User breached a policy or other rules.
     * Reverted back after to {@link AccountStatuses.ACTIVE} after a particular time.
     */
    SUSPENDED: 'Suspended',

    /**
     * Used when a User has breached a policy or other rules multiple times, which resulted in multiple suspensions as
     * well, but still didn't want to change their actions. Usually a ban is permanent.
     */
    BANNED: 'Banned',

    /**
     * Used when a User removes their account themselves or when an Admin removes their account. Promotes automatically
     * to {@link AccountStatuses.PENDING_DELETION} after 12 months or to {@link AccountStatuses.ACTIVE} when a User requests
     * to reactivate their account.
     */
    DISABLED: 'Disabled',

    /**
     * Used when an Account has been removed for 12 months or unused. The User will receive an e-mail to indicate that
     * their account is marked for removal, and will be removed after 1 week unless the User requests for their account
     * to be reactivated or logs back into their account.
     */
    PENDING_DELETION: 'Pending Deletion',
} as const;

export type AccountStatus = (typeof AccountStatuses)[keyof typeof AccountStatuses];
