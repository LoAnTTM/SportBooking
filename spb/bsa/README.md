## Backend server application

### APIs

[APis design](API_DESIGN.md) for the backend server application

### Use Case

#### Notifications

-   User(user, club owner, staff, admin) can see notifications
-   When user register account, they receive a verify email
-   When user booking a order, then club owner (staff) can see booking details. Notification just remind from booking status.
-   When club owner (staff) approve a booking, then user can receive a notification.
-   When user book a order, then user will choose option remind time or not.

notification_type:

-   verify_email (email)
-   forgot_password (email)
-   booking_create (web/mobile)
-   booking_accept (web/mobile)
-   booking_reject (web/mobile)
-   booking_remind (web/mobile)
-   booking_success (web/mobile)

### Role - Permissions

#### Role

-   Admin
-   User
-   Client

#### Permissions

```
user:list
user:read
user:create
user:update
user:delete

unit_service:create
unit_service:update
unit_service:delete

club:create
club:update
club:delete

unit:create
unit:update
unit:delete

location:create
location:update
location:delete

metadata:read
metadata:create
metadata:update

order:club
order:club
order:create
order:approve_request
order:approve_payment

sport_type:create
sport_type:update
sport_type:delete
```
