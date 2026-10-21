# Archify — hướng dẫn sử dụng

> 📄 **Bản trực quan (có sơ đồ tương tác):** [.archify/explainer-huong-dan-archify-20261021-221243/huong-dan-archify.html](.archify/explainer-huong-dan-archify-20261021-221243/huong-dan-archify.html). Trang này được tạo bằng chính Archify, mở bằng trình duyệt để xem.

[Archify](https://github.com/tt-a1i/archify) là skill cho AI agent (Claude Code, Cursor, Codex CLI, OpenCode). Nó biến mô tả, câu hỏi, kế hoạch hoặc codebase thành **một file HTML tự chứa** có sơ đồ tương tác (theme sáng/tối, animation, xuất PNG/SVG/WebM).

## Cài đặt trên máy này

| Thành phần | Trạng thái |
| --- | --- |
| Skill | Cài global tại `C:\Users\PC\.claude\skills\archify` (v3.2.0) |
| Node.js | v22.23.4. Cần **từ v22.20 trở lên**, xem mục [Xử lý lỗi](#xử-lý-lỗi) |
| Demo | `archify-demo\archify-demo.html` |

Cài lại hoặc cài trên máy khác:

```bash
npx skills add tt-a1i/archify -g -a claude-code -s archify -y
```

## Cách dùng thông thường: nói với Claude

Mô tả bằng lời, Claude sẽ tự dùng skill:

> "Vẽ sơ đồ kiến trúc của repo này"
> "Vẽ sequence diagram cho luồng đăng nhập"
> "Vẽ ERD cho schema database"
> "Giải thích X, làm thành một trang"

Quy trình phía sau:

```
Mô tả yêu cầu → Chọn loại sơ đồ → Viết candidate.json → finalize ─┬─ đạt → file HTML
                                                     ▲            └─ lỗi → sửa candidate ┐
                                                     └───────────────────────────────────┘
```

Kết quả nằm trong `.archify/<loại>-<tên>-<thời-gian>/<tên>.html` ở thư mục bạn đang làm việc.

## Các loại sơ đồ

| Loại | Dùng khi | Câu yêu cầu mẫu |
| --- | --- | --- |
| `architecture` | Thành phần hệ thống và kết nối | "Vẽ kiến trúc repo này" |
| `workflow` | Quy trình có bước, nhánh | "Vẽ quy trình deploy CI/CD" |
| `sequence` | Chuỗi gọi API theo thứ tự | "Vẽ sequence luồng login" |
| `dataflow` | Pipeline, ETL, lineage | "Vẽ luồng dữ liệu ETL" |
| `lifecycle` | Trạng thái và chuyển trạng thái | "Vẽ vòng đời đơn hàng" |
| `erd` | Bảng, cột, khóa, quan hệ | "Vẽ ERD schema DB" |
| `class` | Class, interface, kế thừa | "Vẽ class diagram module payment" |
| `tree` | Cây thư mục, module | "Vẽ cây thư mục src" |
| `timeline` | Sự kiện theo thời gian | "Vẽ timeline sự cố" |
| `waterfall` | Thời gian các span của một request | "Vẽ waterfall request checkout" |
| `explainer` | Một trang giải thích, so sánh | "Giải thích X thành một trang" |

Archify cũng nhận Mermaid làm đầu vào. Xem mẫu: <https://archify.si/gallery.html>

## Dùng CLI trực tiếp

```powershell
$A = "$HOME\.claude\skills\archify\bin\archify.mjs"
node $A doctor
```

| Lệnh | Tác dụng |
| --- | --- |
| `doctor` | Kiểm tra cài đặt |
| `demo <thư-mục>` | Tạo sơ đồ demo |
| `guide "<mô tả>"` | Gợi ý loại sơ đồ phù hợp |
| `examples` | Liệt kê ví dụ có sẵn (trong `...\skills\archify\examples\`) |
| `validate <loại> <file.json>` | Chỉ kiểm tra file nguồn |
| `preview <loại> <file.json> <out.html>` | Xem trước, tự cập nhật khi sửa file |
| `finalize <loại> <file.json> <out.html> --json` | Kiểm tra đầy đủ và xuất bản cuối |
| `deliver <loại> <file.json> <out.html> --open` | Validate, render rồi mở |
| `compare architecture <cũ.json> <mới.json> <out.html>` | So sánh kiến trúc trước và sau |
| `check <out.html>` | Kiểm tra lại file HTML đã xuất |

Tuỳ chọn hay dùng: `--quality showcase` (chặt, mặc định khi Claude soạn), `--quality standard` (cho sơ đồ dày), `--repo-root <path>` (sơ đồ dựa trên code thật).

Ví dụ render một mẫu có sẵn:

```powershell
node $A finalize sequence "$HOME\.claude\skills\archify\examples\cache-miss-request.sequence.json" out\cache.html --json
```

## Cấu hình (trong `meta` của file JSON)

| Khoá | Giá trị |
| --- | --- |
| `meta.locale` | `en`, `zh-CN`, `zh-TW`, `es`, `ko`, `ar`. Chưa có tiếng Việt cho giao diện, nhưng nội dung vẫn viết tiếng Việt được |
| `meta.quality_profile` | `showcase` hoặc `standard` |
| `meta.visual_preset` | Phong cách hiển thị |
| `meta.animation` | Bỏ trống để giữ animation mặc định |
| `ARCHIFY_UPDATE_CHECK_DISABLED=1` | Biến môi trường để tắt kiểm tra phiên bản mới |

## Xử lý lỗi

| Triệu chứng | Nguyên nhân | Cách xử lý |
| --- | --- | --- |
| `output/target-changed` hoặc `delivery/ownership-lost` | Node cũ (ví dụ v22.16) trên Windows 11 trả `dev = 0` khi gọi `fs.stat` | Nâng Node lên v22.20+ (đã làm: v22.23.4) |
| `schema/additionalProperties`, `schema/const` | Truyền sai `<loại>` so với file JSON | Dùng đúng loại, ví dụ `*.sequence.json` thì dùng `sequence` |
| Claude không dùng Archify | Câu yêu cầu không nhắc tới sơ đồ | Nói rõ "vẽ sơ đồ…" hoặc "dùng archify" |

Sau khi nâng Node, mở lại VS Code để terminal nhận bản mới.

## Checklist

- [ ] `node --version` in ra v22.20 trở lên
- [ ] `node $A doctor` báo `Archify is ready.`
- [ ] Mở thử `archify-demo\archify-demo.html`
- [ ] Yêu cầu Claude vẽ một sơ đồ và mở file trong `.archify/`
