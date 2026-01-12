# Interlink Dashboard API

Valid requests for this API include:
## Base URL
```
http://localhost:3000
```

---

## Endpoints

### Create User
**POST** `/user`

**Body (JSON):**
```json
{
  "email": "johndoe@email.com",
  "firstName": "John",
  "lastName": "Doe",
  "idNumber": "2025-04770"
  // optional: "role": "admin"
}
```

---

### Get All Users
**GET** `/user`

**Sample:**
```
GET http://localhost:3000/user
```

### Get User by Email
**GET** `/user?email=:email`

**Sample:**
```
GET http://localhost:3000/user?email=jePerez4@up.edu.ph
```

---

### Update User (Self)
**PUT** `/user/email/:email`

**Body (JSON):**
```json
{
  "name": "Carlo Perez",
  "idNumber": "2025-04771"
}
```

---

### Update User (Admin)
**PUT** `/user/admin/email/:email`

**Body (JSON):**
```json
{
  "role": "admin",
  "groupName": "Pod A",
  "groupProgress": 75
}
```

---

### Delete User
**DELETE** `/user/email/:email`

**Sample:**
```
DELETE http://localhost:3000/user/email/jePerez4@up.edu.ph
```

---
