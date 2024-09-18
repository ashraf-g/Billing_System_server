# Billing and Invoicing Application

## Overview

The Billing and Invoicing Application is designed to streamline the management of customer invoices, payments, and services for businesses. This application provides an intuitive interface for administrators to create and manage invoices, ensuring accurate billing and efficient financial tracking.

## Features

- **Admin Management**: Secure user authentication and management.
- **Invoice Management**: Create, read, update, and delete invoices.
- **Invoice Item Management**: Manage multiple items per invoice, including quantity and total price.
- **Payment Processing**: Record payments against invoices with various payment methods.
- **Service Management**: Manage services offered, including descriptions and pricing.

## Technologies Used

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM

## API Documentation

- **Local BaseURL**: localhost:5000/api/v1

### Endpoints

#### **Admin**

#### 1. Admin Signup

- **Endpoint:** `/admin/signup`
- **Method:** `POST`
- **Description:** Registers a new admin user.
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - **201 Created**
    ```json
    {
      "message": "Admin registered successfully.",
      "adminId": "string"
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Validation error message"
    }
    ```

#### 2. Admin Login

- **Endpoint:** `/admin/login`
- **Method:** `POST`
- **Description:** Authenticates an admin user.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - **200 OK**
    ```json
    {
      "message": "Login successful.",
      "token": "jwt_token"
    }
    ```
  - **401 Unauthorized**
    ```json
    {
      "error": "Invalid credentials"
    }
    ```

#### 3. Update Admin

- **Endpoint:** `/admin/update/:id`
- **Method:** `PUT`
- **Description:** Updates the details of an existing admin.
- **Request Parameters:**
  - `id`: Admin ID to update
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string"
  }
  ```
- **Responses:**
  - **200 OK**
    ```json
    {
      "message": "Admin updated successfully."
    }
    ```
  - **404 Not Found**
    ```json
    {
      "error": "Admin not found"
    }
    ```

#### 4. Change Password

- **Endpoint:** `/admin/change-password/:id`
- **Method:** `PUT`
- **Description:** Changes the password of an existing admin.
- **Request Parameters:**
  - `id`: Admin ID
- **Request Body:**
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```
- **Responses:**
  - **200 OK**
    ```json
    {
      "message": "Password changed successfully."
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Old password is incorrect"
    }
    ```

#### 5. Send OTP

- **Endpoint:** `/admin/send-otp`
- **Method:** `POST`
- **Description:** Sends an OTP to the admin's registered email.
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```
- **Responses:**
  - **200 OK**
    ```json
    {
      "message": "OTP sent successfully."
    }
    ```
  - **404 Not Found**
    ```json
    {
      "error": "Admin not found"
    }
    ```

#### 6. Verify OTP

- **Endpoint:** `/admin/verify-otp`
- **Method:** `POST`
- **Description:** Verifies the OTP sent to the admin.
- **Request Body:**
  ```json
  {
    "email": "string",
    "otp": "string"
  }
  ```
- **Responses:**
  - **200 OK**
    ```json
    {
      "message": "OTP verified successfully."
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Invalid OTP"
    }
    ```

#### 7. Reset Password

- **Endpoint:** `/admin/reset-password`
- **Method:** `PUT`
- **Description:** Resets the admin's password after OTP verification.
- **Request Body:**
  ```json
  {
    "email": "string",
    "newPassword": "string",
    "otp": "string"
  }
  ```
- **Responses:**
  - **200 OK**
    ```json
    {
      "message": "Password reset successfully."
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Invalid OTP or email"
    }
    ```

#### **Service**

## Authentication

All endpoints require authentication. Ensure that you include a valid JWT token in the `Authorization` header for each request.

### 1. Create Service

- **Endpoint:** `/service/create`
- **Method:** `POST`
- **Description:** Creates a new service.
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "unit_price": "number"
  }
  ```
- **Responses:**
  - **201 Created**
    ```json
    {
      "message": "Service created successfully.",
      "serviceId": "string"
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Validation error message"
    }
    ```

### 2. Get All Services

- **Endpoint:** `/service/getall`
- **Method:** `GET`
- **Description:** Retrieves all services.
- **Responses:**
  - **200 OK**
    ```json
    [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "unit_price": "number"
      }
    ]
    ```

### 3. Get Service By ID

- **Endpoint:** `/service/get/:id`
- **Method:** `GET`
- **Description:** Retrieves a specific service by its ID.
- **Request Parameters:**
  - `id`: The ID of the service to retrieve.
- **Responses:**
  - **200 OK**
    ```json
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "unit_price": "number"
    }
    ```
  - **404 Not Found**
    ```json
    {
      "error": "Service not found"
    }
    ```

### 4. Update Service

- **Endpoint:** `/service/update/:id`
- **Method:** `PUT`
- **Description:** Updates an existing service.
- **Request Parameters:**
  - `id`: The ID of the service to update.
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "unit_price": "number"
  }
  ```
- **Responses:**
  - **200 OK**
    ```json
    {
      "message": "Service updated successfully."
    }
    ```
  - **404 Not Found**
    ```json
    {
      "error": "Service not found"
    }
    ```

### 5. Delete Service

- **Endpoint:** `/service/delete/:id`
- **Method:** `DELETE`
- **Description:** Deletes a specific service by its ID.
- **Request Parameters:**
  - `id`: The ID of the service to delete.
- **Responses:**
  - **200 OK**
    ```json
    {
      "message": "Service deleted successfully."
    }
    ```
  - **404 Not Found**
    ```json
    {
      "error": "Service not found"
    }
    ```

### 6. Search Service

- **Endpoint:** `/service/search`
- **Method:** `GET`
- **Description:** Searches for services based on a query string.
- **Request Parameters:**
  - `query`: The search term.
- **Responses:**
  - **200 OK**
    ```json
    [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "unit_price": "number"
      }
    ]
    ```
