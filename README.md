# 🏋️‍♂️ GoGain – Gym Membership Management System  

GoGain is a modern **Gym & Fitness Management System** that helps gyms and fitness centers manage memberships, trainers, workout plans, payments, buy gym releted product and member progress – all in one place.  
It is built with a **responsive, user-friendly UI** and follows **industry standards** in backend & frontend development.  

---

## 🚀 Features  

### 👥 User Features
- Register & Login (with secure authentication)  
- Browse gym plans & pricing  
- Online membership purchase with **Khalti/eSewa integration**  
- View and manage personal profile  
- Track membership status and expiry date  
- Access workout plans & trainer info  
- See testimonials and transformation stories  

### 🏢 Admin Features
- Dashboard overview (members, trainers, payments, plans)  
- Add/Edit/Delete gym plans (e.g., Basic, Premium, Yearly)  
- Manage trainers (expertise, availability, profiles)  
- Manage members & their subscriptions  
- Track payments & invoices  
- Automated membership expiry updates  
- Analytics & reports  

### 📱 UI Features
- Fully **responsive design** with **Tailwind CSS**  
- Smooth animations (Framer Motion)  
- Carousel for trainers & testimonials  
- Dark/Light mode support  

---

## 🛠️ Tech Stack  

- **Frontend:** React.js, Tailwind CSS, Axios  
- **Backend:** PHP 
- **Database:** MySQL   
- **Payment Integration:** Khalti, eSewa  
- **Authentication:** JWT (JSON Web Tokens)  
- **Other Tools:** Git, GitHub, Postman  

---

## ⚙️ Installation & Setup  

1. Clone the repository  
   ```bash
   git clone https://github.com/manojneupaneweb/gogain.git
   cd gogain
````

2. Install dependencies

   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Create a `.env` file in backend and configure:

   ```env
   PORT=8000
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=gogain
   JWT_SECRET=your_jwt_secret
   KHALTI_SECRET=your_khalti_secret
   ```

4. Start backend server

   ```bash
   cd backend
   npm run dev
   ```

5. Start frontend

   ```bash
   cd frontend
   npm start
   ```

6. Visit the app on:

   ```
   http://localhost:3000
   ```

---

## 📂 Project Structure

```
GoGain/
│── frontend/       # React + Tailwind frontend
│── backend/        # Node.js/Express or PHP backend
│── database/       # SQL schema & migrations
│── public/         # Assets (images, icons)
│── README.md
```

---

## 📌 Roadmap

* [ ] Add diet/nutrition plan module
* [ ] Mobile app (React Native)
* [ ] Push notifications for plan expiry
* [ ] QR-based member check-in system
* [ ] AI-based personalized workout suggestions

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch (`feature/new-feature`)
3. Commit changes & push
4. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Manoj Neupane**

* 🌐 [manoj-neupane.com.np](http://manoj-neupane.com.np)
* 💼 LinkedIn: [linkedin.com/in/manoj-neupane](https://linkedin.com/in/manoj-neupane)
