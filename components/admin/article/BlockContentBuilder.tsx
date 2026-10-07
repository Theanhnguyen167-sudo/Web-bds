'use client';

import React, { useState } from 'react';
import { ArticleBlock, ArticleBlockType } from '@/types/article';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Edit2,
  Check,
  Type,
  Image as ImageIcon,
  Images,
  Video,
  Quote,
  Table as TableIcon,
  ListChecks,
  Megaphone,
  Building2,
  MapPin,
  Compass,
  FileText,
  X,
  ExternalLink
} from 'lucide-react';

interface BlockContentBuilderProps {
  blocks: ArticleBlock[];
  onChange: (blocks: ArticleBlock[]) => void;
}

const BLOCK_TYPES: { type: ArticleBlockType; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
  { type: 'text', label: 'Văn bản', icon: Type, desc: 'Đoạn ghi chú hoặc hộp thông tin nổi bật' },
  { type: 'image', label: 'Hình ảnh', icon: ImageIcon, desc: 'Ảnh minh họa đơn kèm chú thích' },
  { type: 'gallery', label: 'Gallery', icon: Images, desc: 'Bộ sưu tập 2-4 ảnh dạng lưới' },
  { type: 'video', label: 'Video', icon: Video, desc: 'Video phân tích thị trường hoặc tiến độ' },
  { type: 'quote', label: 'Quote', icon: Quote, desc: 'Trích dẫn ý kiến chuyên gia' },
  { type: 'table', label: 'Bảng', icon: TableIcon, desc: 'Bảng số liệu phân tích giá và diện tích' },
  { type: 'list', label: 'Danh sách', icon: ListChecks, desc: 'Danh sách ưu điểm hoặc các bước cần lưu ý' },
  { type: 'cta', label: 'CTA', icon: Megaphone, desc: 'Hộp kêu gọi hành động / tư vấn miễn phí' },
  { type: 'featured_property', label: 'BĐS nổi bật', icon: Building2, desc: 'Ghim thẻ bất động sản liên quan trong bài' },
  { type: 'map', label: 'Bản đồ', icon: MapPin, desc: 'Tọa độ vị trí thực địa Hà Nội' },
  { type: 'planning_info', label: 'Thông tin quy hoạch', icon: Compass, desc: 'Khối dữ liệu phân khu quy hoạch đô thị' },
  { type: 'related_articles', label: 'Bài viết liên quan', icon: FileText, desc: 'Đề xuất 2-3 bài viết đọc tiếp' },
];

export const BlockContentBuilder: React.FC<BlockContentBuilderProps> = ({ blocks, onChange }) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const handleAddBlock = (type: ArticleBlockType) => {
    let initialData: Record<string, any> = {};

    switch (type) {
      case 'text':
        initialData = { text: 'Nội dung khối văn bản bổ sung hoặc cảnh báo quan trọng dành cho nhà đầu tư...', style: 'info' };
        break;
      case 'image':
        initialData = { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80', caption: 'Hình ảnh thực tế khu đô thị mới Hà Nội' };
        break;
      case 'gallery':
        initialData = {
          images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80',
          ],
        };
        break;
      case 'video':
        initialData = { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', caption: 'Video flycam toàn cảnh tuyến đường' };
        break;
      case 'quote':
        initialData = { quote: 'Đầu tư bất động sản an toàn nhất khi bạn bám sát quy hoạch phân khu đã phê duyệt.', author: 'Chuyên gia HaNoi Realty' };
        break;
      case 'table':
        initialData = {
          headers: ['Phân khu', 'Mức giá Q3/2026', 'Tỷ lệ tăng'],
          rows: [
            ['Khu Cát Linh - Đống Đa', '240 tr/m²', '+12%'],
            ['Khu Cầu Giấy - Dịch Vọng', '135 tr/m²', '+9.5%'],
          ],
        };
        break;
      case 'list':
        initialData = {
          items: ['Kiểm tra quy hoạch 1/500 và chỉ giới đường đỏ', 'Xác minh quyền sở hữu tại Văn phòng Đăng ký Đất đai', 'Định giá bằng thuật toán AI trước khi đặt cọc'],
        };
        break;
      case 'cta':
        initialData = { title: 'Cần thẩm định pháp lý hoặc định giá thửa đất này?', btnText: 'Đặt lịch tư vấn chuyên gia', link: '/reports' };
        break;
      case 'featured_property':
        initialData = { title: 'Nhà phố Hoàng Cầu, Đống Đa - 55m² 5 tầng', price: '12.8 Tỷ', address: 'Hoàng Cầu, Ô Chợ Dừa, Đống Đa', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80' };
        break;
      case 'map':
        initialData = { locationName: 'Trục đường Vành Đai 3 - Phạm Hùng, Cầu Giấy', coordinates: '21.0315, 105.7825' };
        break;
      case 'planning_info':
        initialData = { zone: 'Phân khu đô thị H1-2 (Đất ở hỗn hợp mật độ cao)', note: 'Đã phê duyệt điều chỉnh chỉ giới xây dựng lộ giới 40m' };
        break;
      case 'related_articles':
        initialData = { titles: ['Biến động giá đất Đống Đa 2026', 'Quy hoạch đường Vành đai 4 mới nhất'] };
        break;
    }

    const newBlock: ArticleBlock = {
      id: `blk-${Date.now()}`,
      type,
      title: BLOCK_TYPES.find((b) => b.type === type)?.label,
      data: initialData,
    };

    onChange([...blocks, newBlock]);
    setShowAddMenu(false);
    setEditingBlockId(newBlock.id);
  };

  const handleUpdateBlockData = (id: string, newData: Record<string, any>) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, data: { ...b.data, ...newData } } : b)));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...blocks];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const updated = [...blocks];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleDuplicate = (block: ArticleBlock) => {
    const copy: ArticleBlock = {
      ...block,
      id: `blk-${Date.now()}`,
      title: `${block.title} (Bản sao)`,
      data: JSON.parse(JSON.stringify(block.data)),
    };
    const index = blocks.findIndex((b) => b.id === block.id);
    const updated = [...blocks];
    updated.splice(index + 1, 0, copy);
    onChange(updated);
  };

  const handleDelete = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
    if (editingBlockId === id) setEditingBlockId(null);
  };

  return (
    <div className="space-y-4">
      {/* ── LIST OF BLOCKS ── */}
      {blocks.length === 0 ? (
        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <p className="text-xs font-semibold text-slate-500">Chưa có khối nội dung đặc biệt nào.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Thêm CTA, BĐS nổi bật, quy hoạch, bảng so sánh hoặc trích dẫn để bài viết sinh động hơn.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => {
            const blockMeta = BLOCK_TYPES.find((b) => b.type === block.type);
            const Icon = blockMeta?.icon || Type;
            const isEditing = editingBlockId === block.id;

            return (
              <div
                key={block.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:border-slate-300 transition-all space-y-3"
              >
                {/* Block Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-bold text-navy">{blockMeta?.label || block.type}</span>
                    <span className="text-[10px] text-slate-400 font-mono">#{index + 1}</span>
                  </div>

                  {/* Actions: Move Up, Move Down, Edit, Duplicate, Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                      title="Di chuyển lên"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === blocks.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                      title="Di chuyển xuống"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBlockId(isEditing ? null : block.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isEditing ? 'bg-orange-500 text-white' : 'text-slate-500 hover:bg-slate-100'
                      }`}
                      title={isEditing ? 'Lưu chỉnh sửa' : 'Chỉnh sửa khối'}
                    >
                      {isEditing ? <Check className="h-3.5 w-3.5" /> : <Edit2 className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(block)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Nhân bản khối"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(block.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Xóa khối"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Block Content Display / Inline Edit */}
                {isEditing ? (
                  <div className="p-3 bg-slate-50 rounded-xl space-y-3 text-xs">
                    {block.type === 'quote' && (
                      <>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Nội dung trích dẫn</label>
                          <textarea
                            value={block.data.quote || ''}
                            onChange={(e) => handleUpdateBlockData(block.id, { quote: e.target.value })}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Tác giả / Nguồn</label>
                          <input
                            type="text"
                            value={block.data.author || ''}
                            onChange={(e) => handleUpdateBlockData(block.id, { author: e.target.value })}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </>
                    )}

                    {block.type === 'cta' && (
                      <>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Tiêu đề kêu gọi CTA</label>
                          <input
                            type="text"
                            value={block.data.title || ''}
                            onChange={(e) => handleUpdateBlockData(block.id, { title: e.target.value })}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Nhãn nút bấm</label>
                            <input
                              type="text"
                              value={block.data.btnText || ''}
                              onChange={(e) => handleUpdateBlockData(block.id, { btnText: e.target.value })}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Liên kết URL</label>
                            <input
                              type="text"
                              value={block.data.link || ''}
                              onChange={(e) => handleUpdateBlockData(block.id, { link: e.target.value })}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {block.type === 'planning_info' && (
                      <>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Tên phân khu quy hoạch</label>
                          <input
                            type="text"
                            value={block.data.zone || ''}
                            onChange={(e) => handleUpdateBlockData(block.id, { zone: e.target.value })}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Ghi chú chỉ giới / lộ giới</label>
                          <input
                            type="text"
                            value={block.data.note || ''}
                            onChange={(e) => handleUpdateBlockData(block.id, { note: e.target.value })}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </>
                    )}

                    {block.type === 'featured_property' && (
                      <>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Tiêu đề BĐS</label>
                          <input
                            type="text"
                            value={block.data.title || ''}
                            onChange={(e) => handleUpdateBlockData(block.id, { title: e.target.value })}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Mức giá</label>
                            <input
                              type="text"
                              value={block.data.price || ''}
                              onChange={(e) => handleUpdateBlockData(block.id, { price: e.target.value })}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Địa chỉ</label>
                            <input
                              type="text"
                              value={block.data.address || ''}
                              onChange={(e) => handleUpdateBlockData(block.id, { address: e.target.value })}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {block.type === 'text' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Nội dung văn bản</label>
                        <textarea
                          value={block.data.text || ''}
                          onChange={(e) => handleUpdateBlockData(block.id, { text: e.target.value })}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                          rows={2}
                        />
                      </div>
                    )}

                    {block.type === 'image' && (
                      <>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">URL ảnh</label>
                          <input
                            type="text"
                            value={block.data.url || ''}
                            onChange={(e) => handleUpdateBlockData(block.id, { url: e.target.value })}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Chú thích ảnh</label>
                          <input
                            type="text"
                            value={block.data.caption || ''}
                            onChange={(e) => handleUpdateBlockData(block.id, { caption: e.target.value })}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </>
                    )}

                    {block.type === 'map' && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Địa điểm / Tuyến đường</label>
                        <input
                          type="text"
                          value={block.data.locationName || ''}
                          onChange={(e) => handleUpdateBlockData(block.id, { locationName: e.target.value })}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingBlockId(null)}
                        className="px-3 py-1 rounded-lg bg-orange-500 text-white font-bold text-[11px]"
                      >
                        Xong
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Preview Mode */
                  <div className="text-xs text-slate-600">
                    {block.type === 'quote' && (
                      <blockquote className="border-l-2 border-orange-500 pl-3 italic text-slate-700 bg-orange-50/40 py-1 rounded-r">
                        “{block.data.quote}”
                        {block.data.author && <span className="block not-italic font-bold text-[11px] text-navy mt-1">— {block.data.author}</span>}
                      </blockquote>
                    )}
                    {block.type === 'cta' && (
                      <div className="bg-gradient-to-r from-navy to-slate-800 text-white p-3 rounded-xl flex items-center justify-between gap-2">
                        <div>
                          <p className="font-bold text-xs">{block.data.title}</p>
                          <span className="text-[10px] text-slate-300">Khối Call-To-Action</span>
                        </div>
                        <span className="px-3 py-1 bg-orange-500 text-white font-bold rounded-lg text-[11px] shrink-0">
                          {block.data.btnText}
                        </span>
                      </div>
                    )}
                    {block.type === 'planning_info' && (
                      <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-900 flex items-center gap-2">
                        <Compass className="h-4 w-4 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-bold text-xs">{block.data.zone}</p>
                          <p className="text-[10px] text-emerald-700">{block.data.note}</p>
                        </div>
                      </div>
                    )}
                    {block.type === 'featured_property' && (
                      <div className="flex items-center gap-3 p-2 border border-slate-100 rounded-xl bg-slate-50/60">
                        <img src={block.data.image} alt={block.data.title} className="h-10 w-14 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-navy truncate">{block.data.title}</p>
                          <span className="text-orange-600 font-extrabold text-[11px]">{block.data.price}</span>
                        </div>
                      </div>
                    )}
                    {block.type === 'text' && <p className="italic text-slate-600">{block.data.text}</p>}
                    {block.type === 'image' && (
                      <div className="flex items-center gap-2">
                        <img src={block.data.url} alt={block.data.caption} className="h-10 w-16 rounded object-cover" />
                        <span className="text-[11px] text-slate-500 truncate">{block.data.caption}</span>
                      </div>
                    )}
                    {block.type === 'map' && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-orange-500" />
                        <span>{block.data.locationName}</span>
                      </div>
                    )}
                    {['gallery', 'video', 'table', 'list', 'related_articles'].includes(block.type) && (
                      <p className="text-[11px] text-slate-500 italic">Khối {blockMeta?.label} đã sẵn sàng hiển thị trên bài viết.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── ADD BLOCK BUTTON / MENU ── */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-orange-500 bg-white hover:bg-orange-50/30 text-slate-700 hover:text-orange-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Plus className="h-4 w-4 text-orange-500" />
          <span>+ Thêm khối nội dung đặc biệt</span>
        </button>

        {/* Dropdown Menu of 12 block types */}
        {showAddMenu && (
          <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 animate-in fade-in zoom-in-95">
            {BLOCK_TYPES.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleAddBlock(item.type)}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 text-slate-700 group-hover:text-orange-600 mb-1">
                    <span className="p-1 rounded-md bg-slate-100 group-hover:bg-orange-100 transition-colors">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-bold text-xs">{item.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
