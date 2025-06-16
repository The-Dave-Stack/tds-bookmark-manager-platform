# 1. Software Requirements Specification (SRS) - "The Dave Stack" Bookmark Manager - MVP V1.0

## 1. Introduction and Objectives

### 1.1. Purpose of the Document

This Software Requirements Specification (SRS) document describes the functionalities, features, and constraints of the Minimum Viable Product (MVP) for "The Dave Stack" Bookmark Manager. It will serve as a guide for the design, development, testing, and future iterations of the product.

### 1.2. Project Objectives

* **Portfolio:&#x20;**&#x54;o create a functional and well-designed web application to be included in "The Dave Stack" professional portfolio, demonstrating full-stack development skills with modern technologies.
* **Personal Use:&#x20;**&#x54;o develop a useful tool for the author's personal bookmark management.
* **Community Potential:&#x20;**&#x49;f the project is well-received, to offer it as a free tool for "The Dave Stack" community and the general public, attracting users to the brand.

### 1.3. Design Philosophy

* **Simplicity:**&#x43;lean, intuitive user interface with minimal configuration options. The main focus is efficient bookmark management.
* **Modernity:**&#x43;ontemporary and attractive visual appearance.
* **Bookmark-Centric:**&#x56;iewing and accessing bookmarks should be the central element of the experience.
* **Ease of Use:**&#x41;ll common operations should be easy to perform with the minimum number of clicks/steps.
* **Quick Access:**&#x55;sers should be able to find and access their bookmarks quickly and efficiently.

### 1.4. Target Audience

* **Initial:**&#x54;he developer himself (David - The Dave Stack).
* **Secondary:**&#x55;sers of "The Dave Stack" community and anyone looking for a simple, modern alternative for managing their web bookmarks.

### 1.5. Key Technologies

* **Frontend:**&#x52;eact (with TypeScript)
* **Backend:**&#x4E;estJS (with TypeScript)
* **Database:**&#x50;ostgreSQL
* **Deployment:**&#x44;ocker (consideration for deployment)

## 2. MVP Scope

### 2.1. Included Functionalities

* Public landing page.
* User account management (registration with advanced password validation, login, logout).
* Basic CRUD for bookmarks (Create, Read, Update, Delete).
* Automatic retrieval of title and favicon from URL when adding a bookmark.
* Organization of bookmarks into folders (basic CRUD for folders, single level).
* Bookmark search.
* Tracking of clicks on bookmarks for usage statistics.
* Display of basic usage statistics (e.g., most used bookmarks).
* Option to hide/archive rarely used bookmarks.
* Webhook for adding bookmarks from outside the application (e.g., via a bookmarklet).
* Basic administration panel (user and role management).

### 2.2. Explicitly Excluded Functionalities from MVP V1.0

* Advanced Artificial Intelligence (AI) functionalities for automatic categorization, suggestions, etc.
* Native browser extensions.
* Native mobile applications.
* Bulk import/export of bookmarks.
* Sharing bookmarks or folders with other users.
* Advanced tagging of bookmarks.
* Real-time notifications (e.g., WebSockets for instant UI updates of statistics).
* Advanced multi-language support in the interface (will be developed in a primary language, e.g., Spanish or English, for the MVP; the landing page may have bilingual content if specified).
* Advanced folder nesting (a single-level folder structure is maintained for MVP to simplify).

## 3. User Roles

### 3.1. Registered User (User)

* **Description:**&#x54;he standard user of the application. Can register, log in, and manage their own bookmarks and folders.
* **Permissions:**
  * Manage their own account (view profile, change password - post-MVP).
  * Full CRUD on their own bookmarks.
  * Full CRUD on their own folders.
  * View their own usage statistics.
  * Use the webhook associated with their account.

### 3.2. Administrator (Admin)

* **Description:**&#x55;ser with elevated privileges for general system management.
* **Permissions:**
  * All permissions of the "User" role.
  * Access the administration panel.
  * View the list of all registered users.
  * Assign/revoke the "Admin" role to other users.
  * (Optional MVP) Delete users.
  * (Optional MVP) View global system statistics.

## 4. Functional Requirements

### 4.1. Public Landing Page

* **FR-LP-001: Landing Page Access and Purpose**
  * **Description:**&#x54;he web application shall present a public landing page, accessible to any visitor without requiring authentication. Its main purpose is to introduce "The Dave Stack" Bookmark Manager, highlight its key benefits, and encourage visitors to register or log in.
  * **UI/UX Considerations:**&#x41;ttractive, modern, and professional design, consistent with the application's "simple but modern" philosophy. Content should be concise and persuasive. Fully responsive.
  * **Acceptance Criteria (AC):**
    * The landing page is the default page for unauthenticated visitors accessing the application's root URL.
    * It loads quickly and is visually appealing.
* **FR-LP-002: Landing Page Content and Key Sections**
  * **Description:**&#x54;he landing page shall include several sections to communicate the application's value.
  * **Suggested Sections:**
    1. **Hero Section (Main):**
       * A catchy headline summarizing the value proposition (e.g., "Your smart and accessible bookmark hub" or "Organize your links. Simplify your navigation.").
       * A brief subtitle expanding on the idea.
       * A representative image or illustration of the application or its concept.
       * A clear main Call to Action (CTA) (see FR-LP-003).
    2. **Features/Benefits Section:**
       * Concise description of 2-4 main features and their benefits to the user (e.g., "Intuitive Organization with Folders," "Useful Usage Statistics," "Quick and Easy Access," "Save from Anywhere with Webhook/Bookmarklet").
       * (Optional MVP) Icons or small illustrations for each feature.
    3. **Secondary Call to Action Section (Optional):**
       * Another CTA to register or learn more.
    4. **Footer:**
       * Links to (if they exist or are planned): "About The Dave Stack," "Privacy Policy," "Terms of Service," contact, or social media.
       * Copyright and year.
  * **UI/UX Considerations:**&#x4C;ogical narrative flow guiding the user through the information. Clear, direct, and benefit-oriented texts.
  * **Acceptance Criteria (AC):**
    * All defined sections are present.
    * Content is easily readable and understandable.
    * Images/illustrations are high quality and relevant.
* **FR-LP-003: Calls to Action (CTA)**
  * **Description:**&#x54;he landing page must include clear buttons/links inviting the user to take the desired action (register or log in).
  * **CTA Examples:**
    * "Sign Up Free" / "Get Started Now" (leads to the registration page FR-001).
    * "Log In" (leads to the login page FR-002).
  * **UI/UX Considerations:**&#x43;TA buttons should be prominent and easy to identify.
  * **Acceptance Criteria (AC):**
    * At least one main CTA for registration and a link for login exist.
    * CTAs correctly direct to the registration/login pages.
* **FR-LP-004: Navigation from the Landing Page**
  * **Description:**&#x44;efine how the user navigates from the landing page to other public parts or to the application's functionalities.
  * **Flow:**
    * The landing page may have a simple header with the application logo and "Log In" and "Sign Up" buttons.
    * It will not display navigation elements from the internal application (such as the list of folders or bookmarks).
  * **Acceptance Criteria (AC):**
    * Navigation is clear and does not confuse the public landing page with the authenticated user's application interface.

### 4.2. Account Management (Common)

* **FR-001: New User Registration**
  * **Description:**&#x41;llow a new visitor to create an account by providing basic details and setting a secure password.
  * **Flow:**
    1. The user accesses the registration page (usually via a CTA on the Landing Page).
    2. A form is presented requesting: First Name, Last Name, Email Address, Password, and Password Confirmation.
    3. As the user types the password, the system provides visual feedback on compliance with password security requirements.
    4. The user completes the fields and submits the form.
    5. The system validates the data:
       * All mandatory fields are completed.
       * Valid email format.
       * Password meets the established security requirements.
       * Password and password confirmation match.
    6. If validation is successful and the email does not already exist in the system, the account is created.
    7. The user is redirected to the main application dashboard (or to the login page to sign in).
  * **Form Fields:**
    * First Name (Text, mandatory).
    * Last Name (Text, mandatory).
    * Email (Email, mandatory, must be unique).
    * Password (Password, mandatory).
    * Password Confirmation (Password, mandatory).
  * **Password Security Requirements:**
    * Minimum length of 8 characters.
    * Must contain at least one lowercase letter.
    * Must contain at least one uppercase letter.
    * Must contain at least one number.
    * Must contain at least one special character (e.g., !@#\$%^&\*).
  * **UI/UX Considerations:**
    * Clearly display password requirements to the user (e.g., as help text or a tooltip near the password field).
    * Provide real-time visual feedback as the user types the password, indicating which requirements are met and which are not.
    * Include a "show/hide" password icon in the password and confirmation fields to help the user avoid errors.
    * Error messages must be specific and clear for each failed validation (e.g., "Passwords do not match," "Password must include a number," "Email is already registered").
  * **Acceptance Criteria (AC):**
    * The user cannot register if the email already exists.
    * Registration fails if passwords do not match.
    * Registration fails if the password does not meet all specified security requirements.
    * The password is stored securely in the database (hashed with a robust algorithm like bcrypt).
    * First name, last name, and email fields are correctly saved in the database for the new user.
    * Clear visual and textual feedback is displayed during the validation process and in case of error.
* **FR-002: Login**
  * **Description:**&#x41;llow a registered user to access their account.
  * **Flow:**
    1. The user accesses the login page (usually via a CTA on the Landing Page or header).
    2. The user enters their email and password.
    3. The system validates the credentials.
    4. If correct, the session is initiated, and the user is redirected to the main application dashboard.
  * **Acceptance Criteria (AC):**
    * Display an error message if credentials are incorrect.
    * (Optional MVP) Implement temporary lockout after several failed attempts.
* **FR-003: Logout**
  * **Description:**&#x41;llow an authenticated user to close their active session.
  * **Flow:**
    1. The user clicks the "Logout" button/link (available within the application for authenticated users).
    2. The session is invalidated, and the user is redirected to the Landing Page (FR-LP-001) or login page (FR-002).
  * **Acceptance Criteria (AC):**
    * The user should not be able to access protected sections after logging out.
* **FR-004: (Optional MVP, Post-MVP recommended) Password Recovery**
  * **Description:**&#x41;llow a user who has forgotten their password to reset it.
  * **Typical Flow:**&#x53;ending a reset link to the registered email address.

### 4.3. Bookmark Management (User Role)

* **FR-101: Add New Bookmark**
  * **Description:**&#x41;llow the user to save a new web page as a bookmark.
  * **Flow:**
    1. User clicks "Add Bookmark" within the application.
    2. A form/modal is displayed with a field for the URL.
    3. User enters the URL and submits the form.
    4. Backend:a. Validates the URL (format).b. Attempts to retrieve the page title (\<title>) and favicon URL by making an HTTP request to the provided URL. Set timeouts to prevent blocking.c. If retrieval is successful, pre-fill the title and icon fields.d. If it fails, the title remains empty (or with the URL) and a generic icon is used.
    5. **Frontend:**&#x44;isplays the retrieved title and favicon (or fields for manual editing). Allows the user to edit the title and select the destination folder (root by default).
    6. User confirms. The bookmark is saved in the database associated with their account.
  * **Fields:**&#x55;RL (mandatory), Title (editable), FolderID (optional, defaults to root).
  * **UI/UX Considerations:**&#x51;uick and fluid process. Visual feedback during URL data retrieval.
  * **Acceptance Criteria (AC):**
    * A bookmark can be saved with only the URL.
    * The system must attempt to retrieve title and favicon automatically.
    * The user must be able to overwrite the automatically retrieved title.
    * Connection errors during URL data retrieval must be handled correctly (e.g., invalid URL, timeout).
* **FR-102: View List of Bookmarks**
  * **Description:**&#x44;isplay all of the user's bookmarks or those in a specific folder.
  * **Flow:**
    1. User navigates to the main view or selects a folder.
    2. A list/grid of bookmarks is displayed with: Favicon/Icon, Title (clickable), URL (visible or in tooltip).
  * **Display Options:**&#x53;ort by date added (default), title, frequency of use.
  * **UI/UX Considerations:**&#x43;lean, easy-to-scan interface. Pagination if the list is very long.
  * **Acceptance Criteria (AC):**
    * Each bookmark must display its favicon, title, and be a functional link.
    * The list must be updatable after adding, editing, or deleting bookmarks.
* **FR-103: Edit Existing Bookmark**
  * **Description:**&#x41;llow the user to modify the details of a saved bookmark.
  * **Flow:**
    1. User selects the "Edit" option on a bookmark.
    2. A form/modal is displayed with the current bookmark data (title, URL, folder).
    3. User modifies the desired fields and saves the changes.
  * **Editable Fields:**&#x54;itle, URL, FolderID.
  * **Acceptance Criteria (AC):**
    * Changes must be immediately reflected in the bookmark list.
* **FR-104: Delete Bookmark**
  * **Description:**&#x41;llow the user to delete a bookmark.
  * **Flow:**
    1. User selects the "Delete" option on a bookmark.
    2. A confirmation is displayed (e.g., "Are you sure you want to delete this bookmark?").
    3. User confirms. The bookmark is deleted from the database.
  * **Acceptance Criteria (AC):**
    * Confirmation is required before deletion.
    * The deleted bookmark should no longer appear in the list.
* **FR-105: Search Bookmarks**
  * **Description:**&#x41;llow the user to search for bookmarks by keywords.
  * **Flow:**
    1. User enters text into a search field.
    2. The bookmark list is filtered in real-time (or after pressing Enter) displaying those whose title or URL contain the searched text.
  * **Search Scope:**&#x54;itle, URL.
  * **Acceptance Criteria (AC):**
    * The search must be case-insensitive.
    * Results should update dynamically.
* **FR-106: Access Bookmark and Track Usage**
  * **Description:**&#x4F;pen the bookmark's URL in a new tab and track the click for usage statistics.
  * **Flow:**
    1. User clicks on the bookmark's title/link.
    2. Frontend:a. Immediately opens the bookmark's URL in a new browser tab (window.open(url, '\_blank')).b. Simultaneously (asynchronously), sends a request to the backend to track the click (e.g., POST /api/bookmarks/{bookmarkId}/click).
    3. **Backend:**&#x55;pon receiving the click request, increments the bookmark's click counter and updates the last clicked date.
  * **Acceptance Criteria (AC):**
    * Opening the link should not wait for the backend response for click tracking.
    * The click must be correctly registered in the database.

### 4.4. Folder Management (User Role)

* **FR-201: Create New Folder**
  * **Description:**&#x41;llow the user to create a new folder to organize bookmarks. (For MVP, single-level folders).
  * **Flow:**
    1. User selects the "Create Folder" option.
    2. Enters the folder name.
    3. The folder is created and appears in the folder list.
  * **Fields:**&#x46;older name (mandatory).
  * **Acceptance Criteria (AC):**
    * The folder name must be unique for that user.
    * Empty folder names are not allowed.
* **FR-202: View List of Folders**
  * **Description:**&#x44;isplay the user's list of folders.
  * **Flow:**&#x41; side panel or section displays the list of folders. Selecting a folder updates the bookmark view to show the contents of that folder.
  * **Acceptance Criteria (AC):**
    * There must be a clear way to distinguish the "Root" or "All Bookmarks" folder/view.
* **FR-203: Move Bookmark(s) to a Folder**
  * **Description:**&#x41;llow the user to change a bookmark's folder.
  * **Flow:**
    1. User selects a bookmark.
    2. Chooses the "Move to folder" option.
    3. Selects the destination folder from a list.
    4. The bookmark is associated with the new folder.
  * **(Alternative UI):**&#x44;rag & Drop of the bookmark to the destination folder. (Post-MVP due to complexity).
  * **Acceptance Criteria (AC):**
    * The bookmark should disappear from the source folder and appear in the destination.
* **FR-204: Rename Folder**
  * **Description:**&#x41;llow the user to change the name of an existing folder.
  * **Flow:**
    1. User selects the "Rename" option on a folder.
    2. Enters the new name and saves.
  * **Acceptance Criteria (AC):**
    * The new name must be reflected in the folder list.
* **FR-205: Delete Folder**
  * **Description:**&#x41;llow the user to delete a folder.
  * **Flow:**
    1. User selects the "Delete" option on a folder.
    2. A confirmation is displayed.
    3. **Behavior of Internal Bookmarks for MVP:**&#x42;ookmarks within the deleted folder will be moved to the Root folder (or become unassociated with any folder).
    4. User confirms, the folder is deleted.
  * **Acceptance Criteria (AC):**
    * Confirmation is required before deletion.
    * Bookmarks from the deleted folder are correctly reassigned to the root folder.

### 4.5. Bookmark Usage Statistics (User Role)

* **FR-301: View Usage Statistics**
  * **Description:**&#x53;how the user information about how frequently they access their bookmarks.
  * **Flow:**&#x54;he user accesses a "Statistics" section or the information is integrated into the bookmark view.
  * **Information to Display:**
    * List of the X most clicked bookmarks.
    * Click counter visible for each bookmark (optional, could overload UI).
  * **Acceptance Criteria (AC):**
    * Statistics must be based on clicks tracked via FR-106.
* **FR-302: Sort Bookmarks by Frequency of Use**
  * **Description:**&#x41;llow the user to sort their bookmark list according to which ones they use more or less.
  * **Flow:**&#x53;orting option in the bookmark view ("Most used," "Least used").
  * **Acceptance Criteria (AC):**
    * Sorting must accurately reflect click data.
* **FR-303: Hide/Archive Rarely Used Bookmarks**
  * **Description:**&#x41;llow the user to mark as "hidden" or "archived" those bookmarks they do not use frequently to clean up the main view.
  * **Flow:**
    1. User selects the "Hide" or "Archive" option on a bookmark.
    2. The bookmark is marked as hidden and disappears from the main view (unless filtered by "hidden").
  * **Acceptance Criteria (AC):**
    * Hidden bookmarks should not appear in default views and searches.
* **FR-304: View/Restore Hidden Bookmarks**
  * **Description:**&#x41;llow the user to view the list of their hidden bookmarks and restore them to the main view.
  * **Flow:**
    1. User accesses a "Hidden/Archived Bookmarks" section/filter.
    2. The list of hidden bookmarks is displayed.
    3. User can select "Restore" or "Show" on a bookmark, which returns it to its normal visible state.
  * **Acceptance Criteria (AC):**
    * Restored bookmarks must become visible again in their original folders.

### 4.6. Webhook for Adding Bookmarks (User Role)

* **FR-401: Provision of Webhook Endpoint**
  * **Description:**&#x54;he system must generate a unique and secure webhook endpoint per user.
  * **Flow:**&#x49;n the user's account settings, the webhook URL and an API token for authentication will be displayed.
  * **Security:**&#x54;he API token must be confidential and regenerable by the user.
  * **Acceptance Criteria (AC):**
    * Each user must have a distinct endpoint and token.
* **FR-402: Acceptance of Webhook Data**
  * **Description:**&#x54;he webhook endpoint must accept requests (e.g., POST with JSON) to create new bookmarks.
  * **Expected Payload (JSON):**
    ```json
    {
      "url": "https://www.example.com/interesting-page",
      "title": "Optional Page Title", // If not provided, backend will attempt to fetch it
      "api_token": "USER_API_TOKEN_HERE"
    }
    ```
  * **Backend Processing:**
    1. Validate`api_token`against the user.
    2. Validate`url`.
    3. If`title`is not provided or needs refreshing, attempt to retrieve it from the URL.
    4. Attempt to retrieve favicon.
    5. Save the bookmark associated with the token's user, in their default root folder.
  * **Acceptance Criteria (AC):**
    * The webhook must be protected and only accept requests with a valid token.
    * It must create the bookmark correctly if the data is valid.
    * It must return an appropriate HTTP response (e.g., 201 Created, 400 Bad Request, 401 Unauthorized).
* **FR-403: (Optional MVP) Provision of Bookmarklet**
  * **Description:**&#x4F;ffer the user a JavaScript snippet (bookmarklet) that they can save as a bookmark in their browser. When clicked, this script will take the current page's URL and title and send them to the user's webhook.
  * **Flow:**&#x54;he user copies the bookmarklet code from their profile and adds it to their browser's bookmarks.
  * **Acceptance Criteria (AC):**
    * The bookmarklet must correctly send the current URL and title to the configured webhook.

### 4.7. Administration Functionalities (Admin Role)

* **FR-501: Access to Administration Panel**
  * **Description:**&#x4F;nly users with "Admin" role can access a separate administration section.
  * **Flow:**&#x4C;ink/button visible only to admins that leads to the panel.
  * **Acceptance Criteria (AC):**
    * Non-admin users should not be able to access this section (error 403 Forbidden).
* **FR-502: View List of Registered Users**
  * **Description:**&#x54;he admin can view a list of all users in the system.
  * **Information per User:**&#x49;D, First Name, Last Name, Email, Role (User/Admin), Registration Date. (Do not display passwords).
  * **UI/UX Considerations:**&#x50;aginated table with basic search/filter option.
  * **Acceptance Criteria (AC):**
    * The list must be accurate and up-to-date.
* **FR-503: Assign/Revoke Administrator Role**
  * **Description:**&#x54;he admin can change other users' roles between "User" and "Admin".
  * **Flow:**&#x4F;ption in the user list to change the role. Confirmation is required.
  * **Acceptance Criteria (AC):**
    * An admin should not be able to remove their own admin role if they are the only existing admin.
    * Role changes must take immediate effect on the affected user's permissions.

## 5. Non-Functional Requirements

* **NFR-001: Usability**
  * **Description:**&#x54;he application must be easy to learn and use. The interface must be intuitive, clear, and consistent.
  * **Measures:**
    * Responsive design adapted to mobile devices, tablets, and desktops.
    * Clear and predictable navigation.
    * Understandable error messages and user feedback.
    * Minimum number of clicks for common operations.
* **NFR-002: Performance**
  * **Description:**&#x54;he application must be fast and responsive.
  * **Measures:**
    * Initial load time of the main page (Landing Page and Dashboard): < 3 seconds on a standard connection.
    * Response time for listing bookmarks (after login or folder change): < 1 second for lists up to 200 bookmarks.
    * Search response time: < 1 second.
    * Opening a bookmark (FR-106) should not be blocking for the UI.
* **NFR-003: Security**
  * **Description:**&#x50;rotect user data and system integrity.
  * **Measures:**
    * Secure storage of passwords (hashing with salt, e.g., bcrypt).
    * Protection against common web vulnerabilities (XSS, CSRF, SQL Injection). NestJS and React offer protections, but diligence is required.
    * Use of HTTPS for all communication.
    * Robust authentication and authorization for all API requests, including the webhook.
    * Validation of all input data (frontend and backend).
* **NFR-004: Scalability (Initial Consideration)**
  * **Description:**&#x54;he architecture should allow for future growth in the number of users and bookmarks without significant performance degradation.
  * **Measures:**
    * Efficient database design (proper indexing).
    * Backend designed to be stateless if possible, facilitating horizontal scalability.
    * Consider pagination for long data lists.
* **NFR-005: Maintainability**
  * **Description:**&#x54;he source code must be easy to understand, modify, and extend.
  * **Measures:**
    * Well-structured and modular code (components in React, modules in NestJS).
    * Use of TypeScript for static typing.
    * Adequate comments in the code where necessary.
    * Adherence to coding style guides.
    * (Optional) Unit and integration tests.
* **NFR-006: Compatibility**
  * **Description:**&#x54;he web application must work correctly in the latest versions of modern web browsers.
  * **Supported Browsers (MVP):**&#x4C;atest two versions of Google Chrome, Mozilla Firefox, Microsoft Edge, Safari.

## 6. Data Design (Preliminary Entity-Relationship Model)

* **Table:&#x20;****`Users`**
  * `id`: UUID (Primary Key), auto-generated.
  * `first_name`: VARCHAR(255), Not Null.
  * `last_name`: VARCHAR(255), Not Null.
  * `email`: VARCHAR(255), Unique, Not Null.
  * `password_hash`: VARCHAR(255), Not Null.
  * `role`: VARCHAR(50), Not Null (Values: 'USER', 'ADMIN'), Default: 'USER'.
  * `api_token`: VARCHAR(255), Unique, Nullable (generated on demand).
  * `created_at`: TIMESTAMP, Default: CURRENT\_TIMESTAMP.
  * `updated_at`: TIMESTAMP, Default: CURRENT\_TIMESTAMP.
* **Table:&#x20;****`Folders`**
  * `id`: UUID (Primary Key), auto-generated.
  * `user_id`: UUID (Foreign Key -> Users.id), Not Null.
  * `name`: VARCHAR(255), Not Null.
  * `created_at`: TIMESTAMP, Default: CURRENT\_TIMESTAMP.
  * `updated_at`: TIMESTAMP, Default: CURRENT\_TIMESTAMP.
  * *Constraint:*&#x55;niqueness of`(user_id, name)`.
* **Table:&#x20;****`Bookmarks`**
  * `id`: UUID (Primary Key), auto-generated.
  * `user_id`: UUID (Foreign Key -> Users.id), Not Null.
  * `folder_id`: UUID (Foreign Key -> Folders.id), Nullable (if in root).
  * `url`: TEXT, Not Null.
  * `title`: TEXT, Not Null.
  * `favicon_url`: TEXT, Nullable.
  * `click_count`: INTEGER, Default: 0.
  * `last_clicked_at`: TIMESTAMP, Nullable.
  * `is_hidden`: BOOLEAN, Default: FALSE.
  * `created_at`: TIMESTAMP, Default: CURRENT\_TIMESTAMP.
  * `updated_at`: TIMESTAMP, Default: CURRENT\_TIMESTAMP.
* **Relationships:**
  * A`User`can have many`Folders`.
  * A`User`can have many`Bookmarks`.
  * A`Folder`belongs to one`User`.
  * A`Folder`can have many`Bookmarks`.
  * A`Bookmark`belongs to one`User`.
  * A`Bookmark`can optionally belong to one`Folder`.

## 7. Future Considerations (Post-MVP)

* Implementation of AI functionalities (categorization, tagging, semantic search).
* Development of browser extensions for quickly adding bookmarks.
* Tagging system for more flexible organization.
* Option to import bookmarks from HTML files (standard browser format).
* Option to export bookmarks.
* Sharing specific folders or bookmarks with other users.
* Notifications (e.g., if a saved link is broken).
* Support for folder nesting.
* Interface customization (themes, views).
* Progressive Web Application (PWA) or native mobile application.
* Integration with third-party services (e.g., Pocket, Instapaper).
* Full multi-language support in the internal application.
* Advanced user profile (password change, email management, etc.).
