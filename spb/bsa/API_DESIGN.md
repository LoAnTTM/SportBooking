### Sport booking API design

| SIGN     | DESCRIPTION     |
| -------- | --------------- |
| &#x2705; | Implemented     |
| &#x274c; | Not Implemented |

Group APIs: **_/api/v1_**

---

#### **auth**

Authentication API for user (Admin, Club Owner, Member, User)

| No  | Implemented | Method | Path                  | Permission | Description                                             |
| --- | ----------- | ------ | --------------------- | ---------- | ------------------------------------------------------- |
| 1   | &#x2705;    | POST   | /auth/login           |            | Admin, Club Owner, Member, User can login               |
| 2   | &#x2705;    | POST   | /auth/register        |            | User can register                                       |
| 3   | &#x2705;    | POST   | /auth/refresh         |            | Admin, Club Owner, Member, User can refresh             |
| 4   | &#x274c;    | POST   | /auth/logout          |            | Admin, Club Owner, Member, User can logout              |
| 5   | &#x274c;    | GET    | /auth/verify-email    |            | Club Owner, Member, User can verify email               |
| 6   | &#x274c;    | POST   | /auth/forgot-password |            | Admin, Club Owner, Member, User can use forgot password |
| 7   | &#x274c;    | POST   | /auth/reset-password  |            | Club Owner, Member, User can reset password             |

---

#### **users**

Manage users by Admin, Club Owner, Member

| No  | Implemented | Method | Path                                                  | Permission  | Description                                                                |
| --- | ----------- | ------ | ----------------------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| 1   | &#x2705;    | GET    | /users?i={items}&p={page}&b={order by}&t={order type} | user:list   | Get all users with pagination and sorting and full name depend on **role** |
| 2   | &#x2705;    | GET    | /users/:id                                            | user:read   | Get user by id depend on **role**                                          |
| 3   | &#x2705;    | POST   | /users/                                               | user:create | Create new user depend on **role**                                         |
| 4   | &#x2705;    | PATCH  | /users/:id                                            | user:update | Update user depend on **role**                                             |
| 5   | &#x2705;    | DELETE | /users/:id                                            | user:delete | Delete user depend on **role**                                             |

---

#### **unit_service**

Manage unit services for club and unit

| No  | Implemented | Method | Path                                                                      | Permission          | Description                                                        |
| --- | ----------- | ------ | ------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------ |
| 1   | &#x2705;    | GET    | /unit-services?i={items}&p={page}&b={order by}&t={order type}&u={unit id} | unit_service:list   | Get all services for **unit** with pagination and sorting and name |
| 2   | &#x2705;    | GET    | /unit-services/:id                                                        | unit_service:read   | Get service for **club** or **unit** by id                         |
| 3   | &#x2705;    | POST   | /unit-services/                                                           | unit_service:create | Create service for **club**                                        |
| 4   | &#x2705;    | PATCH  | /unit-services/:id                                                        | unit_service:update | Update, Assign or Unassign service to **unit**                     |
| 5   | &#x2705;    | DELETE | /unit-services/:id                                                        | unit_service:delete | Delete service from **club** by id                                 |

---

#### **clubs**

Manage clubs by Admin, Club Owner

| No  | Implemented | Method | Path                                                                                                            | Permission  | Description                                          |
| --- | ----------- | ------ | --------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------- |
| 1   | &#x274c;    | GET    | /clubs?i={items}&p={page}&b={order by}&t={order type}&c={club name}&lg={longitude}&lt={latitude}&s={sport type} |             | Get all clubs with pagination and sorting and filter |
| 2   | &#x274c;    | GET    | /clubs/:id                                                                                                      |             | Get club by id                                       |
| 3   | &#x274c;    | POST   | /clubs/                                                                                                         | club:create | Create new club                                      |
| 4   | &#x274c;    | PATCH  | /clubs/:id                                                                                                      | club:update | Update club info                                     |
| 5   | &#x274c;    | DELETE | /clubs/:id                                                                                                      | club:delete | Delete club                                          |

---

#### **unit**

Manage units by Admin, Club Owner, Member

| No  | Implemented | Method | Path       | Permission  | Description      |
| --- | ----------- | ------ | ---------- | ----------- | ---------------- |
| 1   | &#x274c;    | GET    | /units/:id |             | Get unit by id   |
| 2   | &#x274c;    | POST   | /units/    | unit:create | Create new unit  |
| 3   | &#x274c;    | PATCH  | /units/:id | unit:update | Update unit info |
| 4   | &#x274c;    | DELETE | /units/:id | unit:delete | Delete unit      |

---

#### **location**

Manage locations

| No  | Implemented | Method | Path       | Permission      | Description         |
| --- | ----------- | ------ | ---------- | --------------- | ------------------- |
| 1   | &#x274c;    | GET    | /locations |                 | Get all locations   |
| 2   | &#x274c;    | POST   | /locations | location:create | Create new location |

---

#### **metadata**

Manage metadata

| No  | Implemented | Method | Path      | Permission      | Description         |
| --- | ----------- | ------ | --------- | --------------- | ------------------- |
| 1   | &#x274c;    | GET    | /metadata |                 | Get all metadata    |
| 2   | &#x274c;    | POST   | /metadata | metadata:create | Create new metadata |

---

#### **order**

Manage orders by Admin, Club Owner, Member, User

| No  | Implemented | Method | Path                                                               | Permission            | Description                      |
| --- | ----------- | ------ | ------------------------------------------------------------------ | --------------------- | -------------------------------- |
| 1   | &#x274c;    | GET    | /orders?i={items}&p={page}&b={order by}&t={order type}&u={unit id} | order:list            | Get all orders                   |
| 2   | &#x274c;    | GET    | /orders/:id                                                        | order:read            | Get order by id                  |
| 3   | &#x274c;    | POST   | /orders/request                                                    | order:create          | Create new order - request order |
| 4   | &#x274c;    | POST   | /orders/approve-request                                            | order:approve_request | Approve or reject request order  |
| 5   | &#x274c;    | POST   | /orders/payment                                                    | order:create          | Create new order - payment       |
| 6   | &#x274c;    | POST   | /orders/approve-payment                                            | order:approve_payment | Approve payment order            |

---
