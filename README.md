# Thư viện tri thức Manulife · VP Đà Nẵng

Website: https://thjntoan.github.io/manulife-library/

Bản tóm tắt chính sách FA, UM, PSM+, hệ chỉ số kinh doanh, lộ trình đào tạo và
máy tính thù lao cho đội ngũ Manulife VP Đà Nẵng.

- 38 bài viết, 42 thuật ngữ, 5 công cụ tính toán, 6 tài liệu PDF.
- Tài liệu PDF được mã hóa AES-256; mật khẩu nội bộ không lưu trong repo.
- Đây là bản tóm tắt phục vụ công việc nội bộ, không phải văn bản chính sách
  chính thức và không thay thế tư vấn của bộ phận compliance.

## Cập nhật

Source of truth nằm trên máy Toàn tại `Documents/Manulife/Library`.

```bash
python build.py
python deploy.py
```

`deploy.py` chỉ copy thư mục `site/` sang repo này. Không sửa trực tiếp trên
GitHub.
