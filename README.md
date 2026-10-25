# Archify — hướng dẫn sử dụng

> 📄 **Bản trực quan (có sơ đồ tương tác):** [.archify/explainer-huong-dan-archify-20261021-221243/huong-dan-archify.html](.archify/explainer-huong-dan-archify-20261021-221243/huong-dan-archify.html). Trang này được tạo bằng chính Archify, mở bằng trình duyệt để xem.

> 🚀 **Trang seminar AI Security:** xem cách deploy ở mục [Trang seminar AI Security](#trang-seminar-ai-security-deploy-lên-vercel).

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

Đủ 18 lệnh theo `archify --help` (v3.2.0). Mình đã chạy thử từng lệnh trên máy này.

`<loại>` là một trong: `architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle`, `erd`, `tree`, `class`, `timeline`, `waterfall`, `explainer`.

### Cài đặt và khám phá

| Lệnh | Tác dụng |
| --- | --- |
| `doctor` | Kiểm tra cài đặt, renderer, schema của mọi loại |
| `demo [thư-mục]` | Tạo một sơ đồ demo |
| `examples` | In đường dẫn các file HTML ví dụ có sẵn |
| `guide ["<mô tả>"] [--json] [--lang en\|zh]` | Gợi ý loại sơ đồ, kèm điều nên có và một prompt mẫu để copy |
| `brands ["<tên/alias/domain/nhóm>"] [--json]` | Tra cứu logo có sẵn (postgresql, redis, kubernetes, openai…) |
| `brands capture <url> [--json]` | Lấy logo từ một website để gắn vào node (có truy cập mạng) |

### Tạo sơ đồ

| Lệnh | Tác dụng |
| --- | --- |
| `finalize <loại> <in.json> <out.html> [--json]` | **Lệnh chính:** validate, deliver, check, browser-check rồi xuất bản cuối |
| `deliver <loại> <in.json> [out.html] [--json] [--open]` | Validate, render an toàn kèm biên nhận `.delivery.json`; `--open` để mở luôn |
| `render <loại> <in.json> [out.html]` | Chỉ render ra HTML, không có biên nhận nên không qua được `check --require-provenance` |
| `preview <loại> <in.json> [out.html] [--no-open]` | Chạy server `127.0.0.1`, theo dõi file nguồn và tự render lại khi bạn sửa (không dùng cho `explainer`) |
| `compare architecture <cũ.json> <mới.json> [out.html] [--receipt path] [--json]` | So sánh hai phiên bản kiến trúc (Architecture Delta) |
| `patch explainer <trang.html> <panel-id> <panel.md> <out.html> [--json]` | Thay một panel `## … {#panel-id}` trong trang explainer, giữ nguyên phần còn lại |
| `migrate workflow <cũ.json> <mới.json> --to-schema 2 [--output x.html] [--json]` | Chuyển workflow từ schema v1 sang v2. Lưu ý: nếu layout cũ vi phạm luật v2 thì bị từ chối (`workflow/route-preset-conflict`), khi đó phải sửa file trước |

### Kiểm tra

| Lệnh | Tác dụng |
| --- | --- |
| `validate <loại> <in.json> [--json] [--layout-json]` | Chỉ kiểm tra file nguồn; `--layout-json` in layout (chỉ cho `architecture`, `workflow`) |
| `inspect <loại> <in.json>` | In JSON layout đã tính: toạ độ, kích thước node (chỉ hỗ trợ `architecture`) |
| `check <out.html> [--json] [--require-provenance]` | Kiểm tra lại HTML đã xuất; `--require-provenance` đòi biên nhận từ `deliver` hoặc `finalize` |
| `browser-check <out.html> [--json\|--summary] [--require-provenance] [--out-dir dir]` | Mở bằng Chrome headless, kiểm tra tràn khung, độ dễ đọc, theme sáng/tối |
| `visual-check <out.html> [--json\|--summary] [--require-provenance] [--out-dir dir]` | Như `browser-check` và chụp thêm ảnh PNG (1440×900, 2048×1320, sáng/tối) để review bằng mắt |

### Tuỳ chọn dùng chung

| Tuỳ chọn | Áp dụng cho | Ý nghĩa |
| --- | --- | --- |
| `--quality showcase\|standard` | render, deliver, finalize, preview, validate, compare, patch | `showcase` chặt (mặc định khi Claude soạn); `standard` cho sơ đồ dày |
| `--repo-root <path>` | hầu hết lệnh tạo sơ đồ | Sơ đồ dựa trên code thật, dẫn nguồn tới file và dòng trong repo |
| `--json` | hầu hết lệnh | In kết quả dạng JSON |
| `--out-dir <dir>` | finalize, browser-check, visual-check | Nơi ghi biên nhận và ảnh chụp (HTML vẫn ở đường dẫn output) |
| `--browser-check` | finalize | Bật bước kiểm tra trong trình duyệt cho explainer (mặc định explainer không chạy bước này) |
| `--receipt <path>` | finalize, compare | Đổi vị trí file biên nhận |
| `--candidate-sha256 <hex>` | finalize | Chỉ xuất nếu file nguồn đúng hash này (chống sửa giữa chừng) |
| `--writing warn\|strict\|off` | validate, deliver, finalize, patch (explainer) | Mức nghiêm của kiểm tra văn phong |

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

## Trang seminar AI Security (deploy lên Vercel)

Thư mục được deploy là [`.archify/explainer-owasp-ai-security-20261024-103927/deploy/`](.archify/explainer-owasp-ai-security-20261024-103927/deploy/). Thư mục này đã được link với project Vercel `owasp_seminar` (thông tin link nằm trong `deploy/.vercel/`). Bản production chạy ở <https://owaspseminar.vercel.app>.

| File | Nội dung |
| --- | --- |
| `index.html` | Mục lục, dẫn đến 3 trang con |
| `owasp.html` | Ba bộ OWASP Top 10 cho AI (do Archify tạo) |
| `outline.html` | Dàn ý và các điểm quan trọng của bài thuyết trình |
| `demo.html` | Trang demo (chưa làm) |
| `site.css`, `site.js` | Style và nút sáng/tối dùng chung cho 3 trang mới |

### Deploy

```powershell
cd .archify\explainer-owasp-ai-security-20261024-103927\deploy
vercel            # bản preview, trả về một URL riêng để xem thử
vercel --prod     # đưa lên production (owaspseminar.vercel.app)
```

Đây là site tĩnh nên không cần build. Vercel phục vụ thẳng các file HTML.

> ⚠️ Luôn chạy `vercel` **bên trong thư mục `deploy/`**. Thư mục gốc của repo cũng có một `.vercel/` link tới cùng project. Nếu chạy ở gốc, Vercel sẽ upload cả repo và site sẽ không có `index.html` đúng.

### Lần đầu trên máy khác

```powershell
npm i -g vercel                         # cài CLI (máy này đang dùng v58.5.1)
vercel login
cd .archify\explainer-owasp-ai-security-20261024-103927\deploy
vercel link --project owasp_seminar     # link lại thư mục với project có sẵn
vercel --prod
```

`.vercel/` và `.env*` đã nằm trong `.gitignore`, không commit hai thứ này.

### Sửa nội dung

- Outline: sửa trực tiếp `outline.html`, rồi chạy lại `vercel --prod`.
- Trang OWASP: được tạo bằng Archify. Nếu tạo lại bằng Archify, copy file HTML mới đè lên `deploy/owasp.html`, rồi chèn lại link `← Mục lục` ngay sau thẻ `<body>`.
- Thêm trang mới: dùng `site.css` và `site.js` như `demo.html`, rồi thêm link vào thanh nav của các trang và vào thẻ mục lục trong `index.html`.
