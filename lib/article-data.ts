import { Article, ArticleCategoryItem, ArticleStatus } from '@/types/article';

export const DEFAULT_ARTICLE_CATEGORIES: ArticleCategoryItem[] = [
  { id: 'market', label: 'Tin thị trường', color: 'bg-blue-500 text-white', badgeBg: 'bg-blue-50', badgeText: 'text-blue-600' },
  { id: 'planning', label: 'Quy hoạch', color: 'bg-emerald-500 text-white', badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-600' },
  { id: 'analysis', label: 'Phân tích BĐS', color: 'bg-purple-500 text-white', badgeBg: 'bg-purple-50', badgeText: 'text-purple-600' },
  { id: 'knowledge', label: 'Kiến thức BĐS', color: 'bg-amber-500 text-white', badgeBg: 'bg-amber-50', badgeText: 'text-amber-600' },
  { id: 'hanoi', label: 'Tin Hà Nội', color: 'bg-rose-500 text-white', badgeBg: 'bg-rose-50', badgeText: 'text-rose-600' },
  { id: 'legal', label: 'Pháp lý', color: 'bg-indigo-500 text-white', badgeBg: 'bg-indigo-50', badgeText: 'text-indigo-600' },
  { id: 'investment', label: 'Đầu tư', color: 'bg-orange-500 text-white', badgeBg: 'bg-orange-50', badgeText: 'text-orange-600' },
];

/**
 * Danh mục ảnh placeholder / fallback chuẩn chuyên đề theo từng Category bài viết BĐS:
 * - Quy hoạch & Dự án: Ảnh bản đồ quy hoạch, sa bàn quy hoạch đô thị
 * - Chính sách & Pháp lý: Ảnh văn bản pháp luật, con dấu, hồ sơ đất đai, búa công lý
 * - Thị trường & Giá đất & Đầu tư: Ảnh cao ốc skyline hiện đại, biểu đồ tài chính BĐS
 * - Phân tích & Kiến thức & Hà Nội: Ảnh đại đô thị, kiến trúc nhà ở
 */
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  // 1. Quy hoạch & Dự án -> Ảnh bản đồ quy hoạch, đại lộ cao tốc đô thị
  planning: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop&q=80',
  project: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=1200&auto=format&fit=crop&q=80',

  // 2. Chính sách & Pháp lý -> Ảnh văn bản, hồ sơ tòa án, búa công lý
  policy: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
  legal: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',

  // 3. Thị trường, Giá đất & Đầu tư -> Ảnh tòa nhà skyline, tài chính BĐS
  market: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
  pricing: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80',
  investment: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80',

  // 4. Phân tích & Hà Nội & Kiến thức
  analysis: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
  hanoi: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
  knowledge: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',

  // 5. Fallback mặc định chung
  default: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80',
};

/**
 * Trả về ảnh fallback chuẩn theo Category bài viết khi ảnh bị null, undefined, rỗng hoặc link bị lỗi
 */
export function getCategoryFallbackImage(category?: string | null): string {
  if (!category) return CATEGORY_FALLBACK_IMAGES.default;
  const key = category.toLowerCase().trim();
  return CATEGORY_FALLBACK_IMAGES[key] || CATEGORY_FALLBACK_IMAGES.default;
}

export function slugifyVietnamese(text: string): string {
  if (!text) return '';
  let str = text.toLowerCase().trim();
  // Thay thế ký tự có dấu tiếng Việt
  str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
  str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
  str = str.replace(/[ìíịỉĩ]/g, 'i');
  str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
  str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
  str = str.replace(/[ỳýỵỷỹ]/g, 'y');
  str = str.replace(/đ/g, 'd');
  // Xóa các ký tự đặc biệt
  str = str.replace(/[^a-z0-9\s-]/g, '');
  // Thay khoảng trắng thành dấu gạch ngang
  str = str.replace(/\s+/g, '-');
  // Xóa gạch ngang kép
  str = str.replace(/-+/g, '-');
  return str.replace(/^-|-$/g, '');
}

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Giá nhà Hà Nội năm 2026: Phân tích xu hướng biến động và kịch bản dòng tiền',
    slug: 'gia-nha-ha-noi-nam-2026',
    excerpt: 'Toàn cảnh dự báo chu kỳ bất động sản Thủ đô 2026 sau khi Luật Đất đai mới có hiệu lực và hạ tầng Metro bứt tốc thi công.',
    content: `<h2>Bức tranh toàn cảnh thị trường BĐS Hà Nội 2026</h2>
<p>Năm 2026 đánh dấu bước ngoặt quan trọng của thị trường bất động sản Thủ đô khi các chính sách mới từ Luật Đất đai 2024 đi vào thực tiễn trọn vẹn, cùng với sự bứt phá về tiến độ của các dự án giao thông trọng điểm.</p>
<p>Theo số liệu thống kê từ hệ thống dữ liệu số HaNoi Realty, mức độ quan tâm đối với phân khúc nhà mặt phố và đất nền ven đô tại các khu vực Hoài Đức, Đông Anh, Thanh Trì đã ghi nhận sự tăng trưởng ổn định 12-16%.</p>
<h3>Các yếu tố cốt lõi chi phối thị trường</h3>
<ul>
<li><strong>Hạ tầng giao thông:</strong> Tuyến Metro số 2 và Metro số 3 hoàn thiện mở ra trục di chuyển nhanh.</li>
<li><strong>Bảng giá đất mới:</strong> Chi phí đầu vào tiệm cận giá trị thị trường làm tăng chi phí phát triển quỹ đất.</li>
<li><strong>Thanh khoản thực tế:</strong> Dòng tiền đầu cơ dịch chuyển mạnh sang các sản phẩm có dòng tiền cho thuê tốt.</li>
</ul>`,
    featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
    category: 'market',
    categoryLabel: 'Tin thị trường',
    categoryColor: 'bg-blue-500 text-white',
    authorId: 'admin-1',
    authorName: 'Ban biên tập HaNoi Realty',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorRole: 'Super Admin',
    status: 'published',
    seoTitle: 'Giá nhà Hà Nội năm 2026 - Phân tích xu hướng và dòng tiền',
    seoDescription: 'Dự báo toàn diện chu kỳ bất động sản Hà Nội năm 2026 cùng số liệu giá bán, bản đồ quy hoạch và khuyến nghị đầu tư an toàn.',
    seoKeywords: 'giá nhà hà nội 2026, bất động sản hà nội, quy hoạch metro hà nội',
    views: 4520,
    readTime: '6 phút',
    createdAt: '2026-09-15T08:30:00Z',
    updatedAt: '2026-10-01T14:20:00Z',
    publishedAt: '2026-09-15T09:00:00Z',
    blocks: [
      {
        id: 'blk-1',
        type: 'quote',
        title: 'Nhận định chuyên gia',
        data: {
          quote: 'Thị trường 2026 không còn chỗ cho đòn bẩy tài chính vô tội vạ. Chỉ những BĐS có pháp lý chuẩn và gần hạ tầng công cộng mới giữ vững giá trị.',
          author: 'TS. Lê Đăng Doanh',
        },
      },
      {
        id: 'blk-2',
        type: 'planning_info',
        title: 'Quy hoạch giao thông liên quan',
        data: {
          zone: 'Trục quy hoạch mở rộng Vành Đai 3.5 & Vành Đai 4',
          district: 'Hà Đông - Hoài Đức - Nam Từ Liêm',
          note: 'Dự kiến hoàn thiện kết nối kỹ thuật cuối năm 2026',
        },
      },
    ],
  },
  {
    id: 'art-policy-luat-dat-dai',
    title: 'Luật Đất đai mới và tác động tới bảng giá đất hàng năm tại Hà Nội: Tái lập mặt bằng chi phí và áp lực tái cấu trúc dòng vốn',
    slug: 'luat-dat-dai-moi-va-tac-dong-bang-gia-dat-ha-noi',
    excerpt: 'Phân tích toàn diện việc bãi bỏ khung giá đất, bảng giá đất hàng năm từ 2026 tác động tới chi phí đầu vào, biên lợi nhuận chủ đầu tư và thanh khoản thị trường.',
    content: `<p>Bước sang quý III/2026, thị trường bất động sản Thủ đô đang chứng kiến những tác động sâu rộng và trực diện nhất từ việc Luật Đất đai 2024 cùng các nghị định hướng dẫn thi hành đi vào đời sống thực tế tròn hai năm. Điểm nhấn mang tính cách mạng chính là việc chính thức xóa bỏ cơ chế "khung giá đất" do Chính phủ ban hành định kỳ 5 năm một lần, thay thế bằng cơ chế "Bảng giá đất hàng năm" do Ủy ban nhân dân cấp tỉnh/thành phố xây dựng và trình Hội đồng nhân dân cùng cấp thông qua, bắt đầu áp dụng từ ngày 01/01/2026.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
    category: 'policy',
    categoryLabel: 'Chính sách & Pháp lý',
    categoryColor: 'bg-blue-600 text-white',
    authorId: 'admin-2',
    authorName: 'ThS. Nguyễn Hoàng Nam',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    authorRole: 'Chuyên gia Phân tích Tài chính BĐS',
    status: 'published',
    seoTitle: 'Luật Đất đai mới và tác động tới bảng giá đất hàng năm tại Hà Nội',
    seoDescription: 'Phân tích toàn diện việc bãi bỏ khung giá đất, bảng giá đất hàng năm từ 2026 tại Hà Nội.',
    seoKeywords: 'luật đất đai 2024, bảng giá đất hà nội 2026, chi phí giải phóng mặt bằng',
    views: 5120,
    readTime: '9 phút',
    createdAt: '2026-09-27T08:00:00Z',
    updatedAt: '2026-09-27T08:00:00Z',
    publishedAt: '2026-09-27T08:00:00Z',
  },
  {
    id: 'art-2',
    title: 'Thị trường BĐS Hà Nội: Giá nhà phố tăng 12% sau thông tin Metro Line 2 chính thức tăng tốc thi công',
    slug: 'metro-line-2-hanoi-gia-nha-pho-tang-12-phan-tram',
    excerpt: 'Sự kết nối giữa các trục giao thông hướng tâm và tuyến Metro số 2 đang tạo lực đẩy mạnh mẽ cho phân khúc nhà phố trung tâm và ven đô.',
    content: `<p>Tuyến đường sắt đô thị số 2 (đoạn Nam Thăng Long - Trần Hưng Đạo) vừa được phê duyệt điều chỉnh tổng mức đầu tư và phương án giải phóng mặt bằng, tạo nên làn sóng quan tâm đặc biệt từ giới đầu tư bất động sản.</p>
<p>Khảo sát thực tế của hệ thống HaNoi Realty cho thấy, trong bán kính 800m quanh các nhà ga C1 (Xuân Đỉnh), C2 (Ngoại Giao Đoàn), C3 (Tây Hồ Tây) và khu vực trung tâm phố cổ, giá chào bán nhà mặt phố và nhà riêng trong ngõ ô tô đã ghi nhận mức tăng từ 10% đến 14% so với cùng kỳ.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&auto=format&fit=crop&q=80',
    category: 'planning',
    categoryLabel: 'Quy hoạch',
    categoryColor: 'bg-emerald-500 text-white',
    authorId: 'admin-2',
    authorName: 'ThS. Nguyễn Hoàng Nam',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    authorRole: 'Chuyên gia Quy hoạch',
    status: 'published',
    seoTitle: 'Metro Line 2 Hà Nội: Giá nhà phố tăng 12% - Phân tích quy hoạch',
    seoDescription: 'Cập nhật tiến độ Metro Line 2 Nam Thăng Long - Trần Hưng Đạo và tác động trực tiếp đến giá nhà đất xung quanh nhà ga.',
    seoKeywords: 'metro line 2 hà nội, giá nhà phố tây hồ, quy hoạch ga c3',
    views: 3890,
    readTime: '5 phút',
    createdAt: '2026-09-20T10:15:00Z',
    updatedAt: '2026-09-28T16:00:00Z',
    publishedAt: '2026-09-20T11:00:00Z',
  },
  {
    id: 'art-3',
    title: 'Top 5 phường có giá đất tăng mạnh nhất quận Đống Đa: Phân tích số liệu thực tế',
    slug: 'top-5-phuong-gia-dat-tang-manh-nhat-dong-da',
    excerpt: 'Dữ liệu giao dịch thực tế cho thấy các phường Ô Chợ Dừa, Láng Hạ và Cát Linh tiếp tục dẫn đầu về thanh khoản và tỷ lệ tăng trưởng giá trị.',
    content: `<p>Với mật độ dân cư cao và hệ thống trường học, bệnh viện hoàn chỉnh, quận Đống Đa luôn là điểm nóng về nhu cầu an cư bền vững và giữ giá an toàn bậc nhất Hà Nội.</p>
<p>Báo cáo quý 3/2026 chỉ ra các căn nhà có diện tích 45-60m² ngõ thông ô tô vào tại phường Láng Hạ hiện đạt ngưỡng 220-260 triệu/m².</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    category: 'analysis',
    categoryLabel: 'Phân tích BĐS',
    categoryColor: 'bg-purple-500 text-white',
    authorId: 'admin-1',
    authorName: 'Ban biên tập HaNoi Realty',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorRole: 'Phòng Nghiên cứu Thị trường',
    status: 'published',
    seoTitle: 'Top 5 phường giá đất tăng mạnh nhất Đống Đa - HaNoi Realty',
    seoDescription: 'Phân tích biến động giá nhà đất quận Đống Đa: Ô Chợ Dừa, Láng Hạ, Cát Linh, Trung Liệt, Khâm Thiên.',
    seoKeywords: 'giá đất đống đa, nhà phố láng hạ, ô chợ dừa',
    views: 2950,
    readTime: '4 phút',
    createdAt: '2026-09-22T09:00:00Z',
    updatedAt: '2026-09-25T11:30:00Z',
    publishedAt: '2026-09-22T09:30:00Z',
  },
  {
    id: 'art-4',
    title: 'Quy hoạch Vành đai 4: Cơ hội vàng và định vị dòng tiền cho nhà đầu tư ven đô',
    slug: 'vanh-dai-4-ha-noi-dinh-vi-dong-tien-ven-do-2026',
    excerpt: 'Định vị các vùng trũng giá và cơ hội giải ngân dòng vốn đầu tư bất động sản ven đô Hà Nội theo tiến độ hoàn thiện của đại dự án Vành đai 4 Vùng Thủ đô.',
    content: `<p>Với quy mô hơn 112 km đi qua ba tỉnh thành (Hà Nội, Hưng Yên, Bắc Ninh), tuyến Vành đai 4 – Vùng Thủ đô đang bước vào giai đoạn tăng tốc thi công các gói thầu xây lắp cuối cùng trong năm 2026. Sự hình thành của đại dự án này đang tái cấu trúc bản đồ giá trị đất đai ven đô theo hướng mở rộng không gian phát triển công nghiệp và đô thị sinh thái.</p>
<h3>Dòng vốn đầu tư thông minh hiện đang tập trung định vị vào 3 phân vùng trọng điểm:</h3>
<ul>
<li><strong>Huyện Hoài Đức & Đan Phượng (Phía Tây):</strong> Trọng tâm đón sóng lên quận kết hợp trục đại lộ Tây Thăng Long và các nút giao Vành đai 4. Các khu đô thị hoàn chỉnh pháp lý ghi nhận mức độ quan tâm tăng 35% nhờ thời gian kết nối về trung tâm Mỹ Đình rút ngắn xuống còn 20 phút.</li>
<li><strong>Huyện Mê Linh (Phía Bắc):</strong> Vùng đất hưởng lợi kép từ hạ tầng cầu Hồng Hà và sự mở rộng của các cụm công nghiệp công nghệ cao, thu hút nhóm nhà đầu tư tìm kiếm quỹ đất giá còn mềm dao động từ 35 – 55 triệu đồng/m².</li>
<li><strong>Huyện Thanh Oai & Thường Tín (Phía Nam):</strong> Điểm tựa từ các nút giao kết nối vào cao tốc Pháp Vân - Cầu Giẽ, phát triển mạnh các cụm kho bãi logistics và đô thị vệ tinh quy mô vừa.</li>
</ul>
<p>Chiến lược giải ngân an toàn trong giai đoạn này là tập trung vào sản phẩm đất thổ cư có sổ đỏ nằm trong bán kính 1 – 3 km từ các nút giao Vành đai 4, tránh các khu vực nằm trực tiếp trong ranh giới cắm mốc giải phóng mặt bằng chưa đền bù.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=1200&auto=format&fit=crop&q=80',
    category: 'planning',
    categoryLabel: 'Quy hoạch & Hạ tầng',
    categoryColor: 'bg-emerald-600 text-white',
    authorId: 'admin-2',
    authorName: 'Hội đồng Chuyên gia BĐS Thủ đô',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    authorRole: 'Chuyên gia Quy hoạch',
    status: 'published',
    seoTitle: 'Quy hoạch Vành đai 4: Cơ hội vàng và định vị dòng tiền ven đô',
    seoDescription: 'Phân tích cơ hội đầu tư đất nền, nhà phố ven đô bám theo trục đại lộ Vành đai 4 vùng Thủ đô.',
    seoKeywords: 'vành đai 4 hà nội, đất nền ven đô, hoài đức, mê linh',
    views: 3280,
    readTime: '5 phút',
    createdAt: '2026-09-22T08:00:00Z',
    updatedAt: '2026-09-29T10:00:00Z',
    publishedAt: '2026-09-22T09:00:00Z',
  },
  {
    id: 'art-5',
    title: 'Cẩm nang pháp lý sổ đỏ: 7 bước kiểm tra quy hoạch trước khi xuống cọc',
    slug: 'cam-nang-phap-ly-so-do-7-buoc-kiem-tra-quy-hoach',
    excerpt: 'Bí quyết thẩm định pháp lý thửa đất, tránh rủi ro dính quy hoạch treo, đất chỉ giới đường đỏ mở rộng.',
    content: `<p>Rủi ro lớn nhất của nhà đầu tư cá nhân là mua phải đất nằm trong diện giải phóng mặt bằng phục vụ công trình công cộng hoặc chỉ giới đường đỏ cắt qua phần lớn diện tích căn nhà.</p>
<p>Bài viết này hướng dẫn chi tiết quy trình 7 bước tra cứu tọa độ WGS84 và đối chiếu trực tiếp trên hệ thống GIS quy hoạch phân khu Hà Nội.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
    category: 'legal',
    categoryLabel: 'Pháp lý',
    categoryColor: 'bg-indigo-500 text-white',
    authorId: 'admin-3',
    authorName: 'Luật sư Trần Văn Bảo',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    authorRole: 'Cố vấn Pháp lý BĐS',
    status: 'draft',
    seoTitle: '7 bước kiểm tra quy hoạch sổ đỏ trước khi đặt cọc',
    seoDescription: 'Hướng dẫn tự tra cứu quy hoạch đất Hà Nội tránh rủi ro dính quy hoạch giải tỏa.',
    seoKeywords: 'kiểm tra quy hoạch sổ đỏ, chỉ giới đường đỏ hà nội, tra cứu quy hoạch',
    views: 120,
    readTime: '7 phút',
    createdAt: '2026-10-02T14:00:00Z',
    updatedAt: '2026-10-05T09:10:00Z',
  },
  {
    id: 'art-5',
    title: 'Chiến lược đầu tư căn hộ dòng tiền cho thuê khu vực Cầu Giấy và Mỹ Đình',
    slug: 'chien-luoc-dau-tu-can-ho-dong-tien-cau-giay-my-dinh',
    excerpt: 'Đánh giá tỷ suất sinh lời căn hộ dịch vụ và chung cư cao cấp quanh các cụm đại học và tòa nhà văn phòng Duy Tân.',
    content: `<p>Nhu cầu thuê nhà của chuyên gia nước ngoài và sinh viên quốc tế tại khu vực Cầu Giấy duy trì ở mức rất cao, đưa tỷ suất sinh lời cho thuê ròng đạt từ 5.2% đến 6.8%/năm.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80',
    category: 'investment',
    categoryLabel: 'Đầu tư',
    categoryColor: 'bg-orange-500 text-white',
    authorId: 'admin-1',
    authorName: 'Ban biên tập HaNoi Realty',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorRole: 'Super Admin',
    status: 'pending',
    seoTitle: 'Đầu tư căn hộ dòng tiền Cầu Giấy - Mỹ Đình',
    seoDescription: 'Báo cáo phân tích tỷ suất lợi nhuận cho thuê chung cư Cầu Giấy và Mỹ Đình.',
    seoKeywords: 'căn hộ dòng tiền hà nội, cho thuê cầu giấy, chung cư mỹ đình',
    views: 640,
    readTime: '5 phút',
    createdAt: '2026-10-04T10:00:00Z',
    updatedAt: '2026-10-04T16:30:00Z',
  },
  {
    id: 'art-6',
    title: 'Quy hoạch chi tiết phân khu đô thị Sông Hồng: Kỳ vọng thay đổi diện mạo Thủ đô',
    slug: 'quy-hoach-chi-tiet-phan-khu-song-hong',
    excerpt: 'Dự án trục không gian cảnh quan Sông Hồng mở ra tiềm năng khai thác du lịch và đô thị sinh thái 2 bên bờ sông.',
    content: `<p>Đồ án quy hoạch phân khu đô thị sông Hồng xác định đây là trục không gian đặc trưng cây xanh mặt nước, văn hóa lịch sử của Thủ đô.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&auto=format&fit=crop&q=80',
    category: 'hanoi',
    categoryLabel: 'Tin Hà Nội',
    categoryColor: 'bg-rose-500 text-white',
    authorId: 'admin-2',
    authorName: 'ThS. Nguyễn Hoàng Nam',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    authorRole: 'Chuyên gia Quy hoạch',
    status: 'hidden',
    seoTitle: 'Quy hoạch phân khu đô thị Sông Hồng Hà Nội',
    seoDescription: 'Bản đồ quy hoạch 2 bờ sông Hồng đoạn qua Hà Nội.',
    seoKeywords: 'quy hoạch sông hồng, đô thị sinh thái sông hồng',
    views: 890,
    readTime: '6 phút',
    createdAt: '2026-09-10T08:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z',
  },
];

const ARTICLES_STORAGE_KEY = 'hanoi_platform_articles_v2026_published';
const CATEGORIES_STORAGE_KEY = 'hanoi_platform_article_categories_v2026';

export function getStoredArticles(): Article[] {
  if (typeof window === 'undefined') return INITIAL_ARTICLES;
  try {
    const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    const parsed: Article[] = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ARTICLES;
  } catch {
    return INITIAL_ARTICLES;
  }
}

export function saveStoredArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
    window.dispatchEvent(new Event('articles_updated'));
  } catch (err) {
    console.warn('Lỗi lưu articles vào localStorage:', err);
  }
}

export function getStoredCategories(): ArticleCategoryItem[] {
  if (typeof window === 'undefined') return DEFAULT_ARTICLE_CATEGORIES;
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_ARTICLE_CATEGORIES));
      return DEFAULT_ARTICLE_CATEGORIES;
    }
    const parsed: ArticleCategoryItem[] = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ARTICLE_CATEGORIES;
  } catch {
    return DEFAULT_ARTICLE_CATEGORIES;
  }
}

export function saveStoredCategories(cats: ArticleCategoryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
  } catch (err) {
    console.warn('Lỗi lưu categories vào localStorage:', err);
  }
}

export function addCategory(name: string): ArticleCategoryItem {
  const cats = getStoredCategories();
  const id = slugifyVietnamese(name);
  const existing = cats.find((c) => c.id === id);
  if (existing) return existing;

  const colors = [
    { color: 'bg-teal-500 text-white', badgeBg: 'bg-teal-50', badgeText: 'text-teal-600' },
    { color: 'bg-cyan-500 text-white', badgeBg: 'bg-cyan-50', badgeText: 'text-cyan-600' },
    { color: 'bg-violet-500 text-white', badgeBg: 'bg-violet-50', badgeText: 'text-violet-600' },
    { color: 'bg-pink-500 text-white', badgeBg: 'bg-pink-50', badgeText: 'text-pink-600' },
  ];
  const colorScheme = colors[cats.length % colors.length];

  const newCat: ArticleCategoryItem = {
    id,
    label: name,
    color: colorScheme.color,
    badgeBg: colorScheme.badgeBg,
    badgeText: colorScheme.badgeText,
  };

  const updated = [...cats, newCat];
  saveStoredCategories(updated);
  return newCat;
}

export function getArticleById(id: string): Article | undefined {
  const articles = getStoredArticles();
  return articles.find((a) => a.id === id || a.slug === id);
}

export function saveArticle(articleData: Partial<Article>): Article {
  const articles = getStoredArticles();
  const now = new Date().toISOString();
  const cats = getStoredCategories();
  const catObj = cats.find((c) => c.id === articleData.category) || cats[0];

  const finalTitle = (articleData.title || 'Bài viết chưa đặt tên').trim();
  const generatedSlug = slugifyVietnamese(finalTitle) || `bai-viet-${Date.now()}`;
  const finalSlug = (articleData.slug && articleData.slug.trim()) ? slugifyVietnamese(articleData.slug.trim()) : generatedSlug;

  const isEditing = Boolean(articleData.id && articles.some((a) => a.id === articleData.id));

  let savedArticle: Article;

  if (isEditing) {
    savedArticle = {
      ...(articles.find((a) => a.id === articleData.id)!),
      ...articleData,
      title: finalTitle,
      slug: finalSlug,
      categoryLabel: catObj.label,
      categoryColor: catObj.color,
      updatedAt: now,
      publishedAt: articleData.status === 'published' ? (articleData.publishedAt || now) : articleData.publishedAt,
    } as Article;

    const updatedList = articles.map((a) => (a.id === savedArticle.id ? savedArticle : a));
    saveStoredArticles(updatedList);
  } else {
    savedArticle = {
      id: `art-${Date.now()}`,
      title: finalTitle,
      slug: finalSlug,
      excerpt: articleData.excerpt || '',
      content: articleData.content || '',
      featuredImage: articleData.featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
      category: articleData.category || 'market',
      categoryLabel: catObj.label,
      categoryColor: catObj.color,
      authorId: articleData.authorId || 'admin-1',
      authorName: articleData.authorName || 'Ban biên tập HaNoi Realty',
      authorAvatar: articleData.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      authorRole: articleData.authorRole || 'Super Admin',
      status: articleData.status || 'draft',
      seoTitle: articleData.seoTitle || finalTitle,
      seoDescription: articleData.seoDescription || (articleData.excerpt || '').slice(0, 160),
      seoKeywords: articleData.seoKeywords || '',
      views: 0,
      readTime: `${Math.max(3, Math.ceil((articleData.content?.length || 500) / 400))} phút`,
      blocks: articleData.blocks || [],
      tags: articleData.tags || [],
      createdAt: now,
      updatedAt: now,
      publishedAt: articleData.status === 'published' ? now : undefined,
    };

    const updatedList = [savedArticle, ...articles];
    saveStoredArticles(updatedList);
  }

  return savedArticle;
}

export function deleteArticle(id: string): void {
  const articles = getStoredArticles();
  const updatedList = articles.filter((a) => a.id !== id);
  saveStoredArticles(updatedList);
}

export function duplicateArticle(id: string): Article | null {
  const articles = getStoredArticles();
  const target = articles.find((a) => a.id === id);
  if (!target) return null;

  const now = new Date().toISOString();
  const duplicated: Article = {
    ...target,
    id: `art-${Date.now()}`,
    title: `${target.title} (Bản sao)`,
    slug: `${target.slug}-copy-${Date.now().toString().slice(-4)}`,
    status: 'draft',
    views: 0,
    createdAt: now,
    updatedAt: now,
    publishedAt: undefined,
  };

  const updatedList = [duplicated, ...articles];
  saveStoredArticles(updatedList);
  return duplicated;
}

export function toggleArticleStatus(id: string, newStatus: ArticleStatus): void {
  const articles = getStoredArticles();
  const now = new Date().toISOString();
  const updatedList = articles.map((a) => {
    if (a.id === id) {
      return {
        ...a,
        status: newStatus,
        updatedAt: now,
        publishedAt: newStatus === 'published' && !a.publishedAt ? now : a.publishedAt,
      };
    }
    return a;
  });
  saveStoredArticles(updatedList);
}

/**
 * Tuỳ chọn truy vấn bài viết cho khối hiển thị mới, tự động loại trừ các bài viết
 * đã xuất hiện ở phần Hero hoặc các khối hiển thị trước đó.
 */
export interface GetArticlesForBlockOptions<T = Article> {
  exclude_ids?: string[];
  previousBlocks?: Array<T[] | string[]>;
  category?: string | string[];
  status?: ArticleStatus;
  limit?: number;
  predicate?: (article: T) => boolean;
}

/**
 * Lấy danh sách bài viết cho khối mới, tự động hỗ trợ exclude_ids và tổng hợp
 * ID từ các khối hiển thị trước đó (previousBlocks) để chống trùng lặp.
 */
export function getArticlesForBlock<T extends { id: string; category?: string; status?: string }>(
  articles: T[],
  options: GetArticlesForBlockOptions<T> = {}
): T[] {
  const { exclude_ids = [], previousBlocks = [], category, status, limit, predicate } = options;

  // Gom toàn bộ ID từ exclude_ids và các khối trước đó vào 1 Set duy nhất
  const excludeSet = new Set<string>(exclude_ids);
  for (const block of previousBlocks) {
    if (Array.isArray(block)) {
      for (const item of block) {
        if (typeof item === 'string') {
          excludeSet.add(item);
        } else if (item && typeof item === 'object' && 'id' in item) {
          excludeSet.add((item as { id: string }).id);
        }
      }
    }
  }

  const result = articles.filter((article) => {
    // 1. Loại trừ nếu ID bài viết đã xuất hiện trong exclude_ids
    if (excludeSet.has(article.id)) return false;

    // 2. Lọc theo trạng thái xuất bản nếu có chỉ định
    if (status && article.status && article.status !== status) return false;

    // 3. Lọc theo danh mục
    if (category && article.category) {
      if (Array.isArray(category)) {
        if (!category.includes(article.category)) return false;
      } else if (category !== 'all' && article.category !== category) {
        return false;
      }
    }

    // 4. Lọc theo predicate tuỳ biến
    if (predicate && !predicate(article)) return false;

    return true;
  });

  return typeof limit === 'number' && limit > 0 ? result.slice(0, limit) : result;
}

/**
 * Lọc danh sách bài viết phổ biến (Đọc nhiều nhất / Top Views) đảm bảo DISTINCT:
 * Mỗi bài viết chỉ xuất hiện tại đúng 1 vị trí thứ hạng duy nhất, loại bỏ trùng lặp theo ID và tiêu đề.
 */
export function getDistinctPopularArticles<T extends { id: string; title: string; views?: number; slug?: string }>(
  articles: T[],
  limit: number = 5
): T[] {
  const sorted = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0));
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const distinctList: T[] = [];

  const normalizeTitle = (title: string) =>
    title
      .toLowerCase()
      .replace(/[.,:;!?'"“”‘’\(\)\[\]\-–—]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  for (const article of sorted) {
    const idKey = article.id?.trim();
    const titleKey = article.title ? normalizeTitle(article.title) : '';

    // Nếu bài viết đã xuất hiện ở thứ hạng cao hơn thì bỏ qua
    if (
      (idKey && seenIds.has(idKey)) ||
      (titleKey && seenTitles.has(titleKey))
    ) {
      continue;
    }

    if (idKey) seenIds.add(idKey);
    if (titleKey) seenTitles.add(titleKey);

    distinctList.push(article);

    if (distinctList.length >= limit) {
      break;
    }
  }

  return distinctList;
}
