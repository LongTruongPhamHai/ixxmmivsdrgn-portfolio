# URLs cần điền vào Payload Admin UI

**Ngày tạo:** 2026-09-06  
**Admin URL:** http://localhost:3000/admin

---

## 📋 EXPERIENCE COLLECTION

### Company: CodeDream
- **Field:** `url` (Website Công Ty)
- **Giá trị gợi ý:** *(Điền URL thực tế của công ty CodeDream)*

### Project 1: CDOJ - CodeDream Online Judge
- **Thuộc:** CodeDream
- **Field:** `projects[].url` (Đường dẫn dự án)
- **Giá trị gợi ý:** *(Điền URL thực tế của CDOJ)*

### Project 2: CDCMS - CodeDream CMS
- **Thuộc:** CodeDream
- **Field:** `projects[].url` (Đường dẫn dự án)
- **Giá trị gợi ý:** *(Điền URL thực tế của CDCMS)*

---

## 🎓 SKILLS COLLECTION - Documentation URLs

Gợi ý URLs chính thức cho từng skill:

### 1. FastAPI
- **Field:** `docsUrl`
- **Giá trị gợi ý:** `https://fastapi.tiangolo.com`

### 2. Django
- **Field:** `docsUrl`
- **Giá trị gợi ý:** `https://www.djangoproject.com`

### 3. PayloadCMS
- **Field:** `docsUrl`
- **Giá trị gợi ý:** `https://payloadcms.com`

### 4. PostgreSQL
- **Field:** `docsUrl`
- **Giá trị gợi ý:** `https://www.postgresql.org`

### 5. Python
- **Field:** `docsUrl`
- **Giá trị gợi ý:** `https://www.python.org`

### 6. TypeScript
- **Field:** `docsUrl`
- **Giá trị gợi ý:** `https://www.typescriptlang.org`

### 7. Git/GitHub
- **Field:** `docsUrl`
- **Giá trị gợi ý:** `https://git-scm.com` hoặc `https://docs.github.com`

### 8. MongoDB
- **Field:** `docsUrl`
- **Giá trị gợi ý:** `https://www.mongodb.com`

### 9. Next.js
- **Field:** `docsUrl`
- **Giá trị gợi ý:** `https://nextjs.org`

### 10. JavaScript
- **Field:** `docsUrl`
- **Giá trị gợi ý:** `https://developer.mozilla.org/en-US/docs/Web/JavaScript`

---

## ✅ KHÔNG CẦN CẬP NHẬT

### Education Collection
- Trường Đại học Thủy Lợi: Đã có `schoolUrl`

### Projects Collection  
- Smart Parking IoT: Đã có `links.demo`

---

## 📝 HƯỚNG DẪN

1. Chạy dev server: `npm run dev`
2. Truy cập Admin UI: http://localhost:3000/admin
3. Điền URLs theo từng collection:
   - **Experience:** Collections → Experience → CodeDream → Edit
   - **Skills:** Collections → Skills → [Chọn từng skill] → Edit
4. Sau khi điền xong, chạy lại script để verify:
   ```bash
   npx tsx scripts/check-url-fields.ts
   ```
5. Chuyển sang Task 2: UI Render Links

---

**Tổng cộng:** 13 URLs (3 Experience + 10 Skills)
