# Dùng Archify thế nào trên máy này? {#archify-guide}

Bạn chỉ cần **mô tả bằng lời cho Claude**: skill Archify tự soạn file nguồn, tự kiểm tra rồi xuất một file HTML tương tác vào thư mục `.archify/`.

- Skill đã cài global cho Claude Code tại `C:\Users\PC\.claude\skills\archify`.[](source:skill)
- Node phải từ v22.20 trở lên; máy đang dùng v22.23.4 nên đã chạy được.
- Có 10 loại sơ đồ và một dạng trang giải thích (explainer).[](source:readme)
- Muốn tự chạy thì dùng CLI `archify.mjs` với các lệnh `guide`, `preview`, `finalize`.

@answer scope="Archify v3.2.0 · Claude Code trên Windows 11 · Node v22.23.4"
@meta locale=en
@source readme title="Archify README trên GitHub" url=https://github.com/tt-a1i/archify
@source skill title="SKILL.md của skill Archify" url=https://github.com/tt-a1i/archify/blob/main/SKILL.md
@source gallery title="Archify gallery" url=https://archify.si/gallery.html

## Từ yêu cầu tới file HTML diễn ra thế nào? {#flow}

@workflow id=usage-flow title="Quy trình dùng Archify"
| lane ask | Bạn yêu cầu |
| lane author | Claude soạn |
| lane deliver | Kiểm tra và xuất |
| request | Mô tả yêu cầu | external | ask |
| pick | Chọn loại sơ đồ | backend | author |
| write | Viết candidate | backend | author |
| finalize | Chạy finalize | security | deliver |
| ok | Đạt kiểm tra? | security | deliver |
| fix | Sửa candidate | backend | deliver |
| open | Mở file HTML | frontend | deliver |
| request > pick | |
| pick > write | |
| write > finalize | |
| finalize > ok | |
| ok > open | có | emphasis |
| ok > fix | không | dashed |
| fix > finalize | chạy lại | dashed |

@steps id=flow-steps
| s-request | Mô tả yêu cầu | Nói rõ chủ đề và loại sơ đồ, ví dụ “vẽ sơ đồ kiến trúc repo này”. | usage-flow | request |
| s-pick | Chọn loại sơ đồ | Claude chọn 1 trong 10 loại; nếu mơ hồ thì dùng lệnh `guide`. | usage-flow | pick |
| s-write | Viết candidate | Claude viết `candidate.json` trong thư mục `.archify/<loại>-<tên>-<thời gian>/`. | usage-flow | write |
| s-finalize | Chạy finalize | Lệnh này validate, render, kiểm tra HTML trong trình duyệt thật. | usage-flow | finalize |
| s-fix | Sửa candidate | Nếu một bước kiểm tra lỗi, Claude sửa đúng chỗ rồi chạy lại. | usage-flow | fix |
| s-open | Mở file HTML | File HTML tự chứa; mở bằng trình duyệt hoặc gửi cho người khác. | usage-flow | open |

## Nên chọn loại sơ đồ nào? {#types}

| Loại | Dùng khi | Câu yêu cầu mẫu |
| --- | --- | --- |
| `architecture` | Thành phần hệ thống và cách chúng nối nhau | “Vẽ kiến trúc của repo này” |
| `workflow` | Quy trình có bước và nhánh | “Vẽ quy trình deploy CI/CD” |
| `sequence` | Chuỗi gọi API theo thứ tự | “Vẽ sequence luồng đăng nhập” |
| `dataflow` | Dữ liệu chảy qua pipeline | “Vẽ luồng dữ liệu ETL” |
| `lifecycle` | Trạng thái và chuyển trạng thái | “Vẽ vòng đời một đơn hàng” |
| `erd` | Bảng, cột, khóa và quan hệ | “Vẽ ERD cho schema database” |
| `class` | Class, interface và quan hệ kế thừa | “Vẽ class diagram module payment” |
| `tree` | Cấu trúc cây: thư mục, module | “Vẽ cây thư mục của src” |
| `timeline` | Sự kiện theo thời gian | “Vẽ timeline sự cố hôm qua” |
| `waterfall` | Thời gian từng span của một request | “Vẽ waterfall cho request checkout” |
| `explainer` | Một trang giải thích, so sánh, kết luận | “Giải thích X, làm thành một trang” |

Archify cũng nhận Mermaid làm đầu vào và chuyển sang sơ đồ tương ứng. Xem mẫu thật ở gallery.[](source:gallery)

## Lệnh CLI nào hay dùng khi tự chạy? {#cli}

```powershell title="Đặt đường dẫn tới CLI (PowerShell)"
$A = "$HOME\.claude\skills\archify\bin\archify.mjs"
node $A doctor
node $A guide "mô tả tình huống của bạn"
```

| Lệnh | Tác dụng |
| --- | --- |
| `doctor` | Kiểm tra cài đặt và các renderer |
| `demo <thư-mục>` | Tạo một sơ đồ demo |
| `guide "<mô tả>"` | Gợi ý loại sơ đồ phù hợp |
| `examples` | Liệt kê các file ví dụ có sẵn |
| `validate <loại> <file.json>` | Chỉ kiểm tra file nguồn |
| `preview <loại> <file.json> <out.html>` | Xem trước trực tiếp, tự cập nhật khi sửa |
| `finalize <loại> <file.json> <out.html> --json` | Kiểm tra đầy đủ và xuất bản cuối |
| `compare architecture <cũ.json> <mới.json>` | So sánh kiến trúc trước và sau |

Thêm `--quality showcase` để kiểm tra chất lượng trình bày chặt hơn, hoặc `standard` cho sơ đồ dày.

## Cấu hình những gì trong file nguồn? {#config}

@facts
| `meta.locale` | `en`, `zh-CN`, `zh-TW`, `es`, `ko`, `ar`; chưa có tiếng Việt cho giao diện |
| `meta.quality_profile` | `showcase` hoặc `standard` |
| `meta.visual_preset` | Chọn phong cách hiển thị |
| `meta.animation` | Bỏ trống để giữ chuyển động mặc định |
| `ARCHIFY_UPDATE_CHECK_DISABLED=1` | Tắt kiểm tra phiên bản mới |

Nội dung chữ trong sơ đồ vẫn viết tiếng Việt được; chỉ nút và nhãn giao diện là theo `locale`.

## Gặp lỗi thì xử lý ra sao? {#troubleshoot}

| Triệu chứng | Nguyên nhân | Cách xử lý |
| --- | --- | --- |
| `output/target-changed` hoặc `delivery/ownership-lost` | Node cũ trên Windows 11 trả `dev = 0` khi gọi `stat` | Nâng Node lên v22.20 trở lên {good:Đã sửa} |
| `schema/additionalProperties` | Sai loại sơ đồ so với file nguồn | Truyền đúng `<loại>` khớp với file JSON |
| Claude không dùng Archify | Câu yêu cầu không nhắc tới sơ đồ | Nói rõ “vẽ sơ đồ …” hoặc “dùng archify” |

@callout level=warning title="Sau khi nâng Node"
Đóng và mở lại VS Code để terminal nhận Node mới.

## Trước khi dùng, kiểm tra gì? {#checklist}

- [ ] `node --version` in ra v22.20 trở lên.
- [ ] `node $A doctor` báo “Archify is ready.”
- [ ] Mở thử `archify-demo\archify-demo.html` trong trình duyệt.
- [ ] Gõ cho Claude một yêu cầu vẽ sơ đồ và mở file trong `.archify/`.
