
import { useCallback, useEffect, useState } from 'react';
import './App.css';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_URL = `${API_BASE}/api/foods`;

const EMPTY_FORM = {
  foodId: '',
  name: '',
  category: '',
  cuisine: '',
  ingredients: '',
  price: '',
  quantity: '',
  description: '',
  imageUrl: '',
};

function App() {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadFoods = useCallback(async (keyword = '') => {
    setLoading(true);
    setError('');

    try {
      const url = keyword.trim()
        ? `${API_URL}?search=${encodeURIComponent(keyword.trim())}`
        : API_URL;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Không thể tải danh sách món ăn.');
      }

      setFoods(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(
        `${err.message} Hãy kiểm tra backend tại cổng 5000 và kết nối MongoDB Atlas.`
      );
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEdit(food) {
    setForm({
      foodId: food.foodId || '',
      name: food.name || '',
      category: food.category || '',
      cuisine: food.cuisine || '',
      ingredients: Array.isArray(food.ingredients)
        ? food.ingredients.join(', ')
        : '',
      price: food.price ?? '',
      quantity: food.quantity ?? '',
      description: food.description || '',
      imageUrl: food.imageUrl || '',
    });

    setEditingId(food._id);
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const payload = {
      foodId: form.foodId.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      cuisine: form.cuisine.trim(),
      ingredients: form.ingredients
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      price: Number(form.price),
      quantity: Number(form.quantity),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
    };

    if (
      !payload.foodId ||
      !payload.name ||
      !payload.category ||
      !payload.cuisine ||
      form.price === '' ||
      form.quantity === ''
    ) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc.');
      setSaving(false);
      return;
    }

    if (
      !Number.isFinite(payload.price) ||
      payload.price < 0 ||
      !Number.isInteger(payload.quantity) ||
      payload.quantity < 0
    ) {
      setError('Giá phải từ 0 trở lên; số lượng phải là số nguyên không âm.');
      setSaving(false);
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Không thể lưu món ăn.');
      }

      setMessage(
        result.message ||
          (editingId
            ? 'Cập nhật món ăn thành công!'
            : 'Thêm món ăn thành công!')
      );

      resetForm();
      await loadFoods(search);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(food) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa món "${food.name}" (${food.foodId}) không?`
    );

    if (!confirmed) return;

    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_URL}/${food._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Không thể xóa món ăn.');
      }

      setMessage(result.message || 'Xóa món ăn thành công!');

      if (editingId === food._id) resetForm();

      await loadFoods(search);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    loadFoods(search);
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(Number(price) || 0);
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">FOOD MANAGEMENT SYSTEM</p>
          <h1>Quản lý món ăn</h1>
          <p className="hero-description">
            Quản lý danh sách món ăn, thông tin, giá bán và số lượng trong kho.
          </p>
        </div>

        <div className="hero-icon" aria-hidden="true">
          🍜
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-icon">🍽️</span>
          <div>
            <p>Tổng số món ăn</p>
            <strong>{foods.length}</strong>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <p>Tổng số lượng</p>
            <strong>
              {foods.reduce(
                (total, food) => total + (Number(food.quantity) || 0),
                0
              )}
            </strong>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon">💰</span>
          <div>
            <p>Giá trung bình</p>
            <strong className="average-price">
              {foods.length
                ? formatPrice(
                    foods.reduce(
                      (total, food) => total + (Number(food.price) || 0),
                      0
                    ) / foods.length
                  )
                : '0 ₫'}
            </strong>
          </div>
        </article>
      </section>

      {message && (
        <div className="alert success" role="status">
          <span>✓</span> {message}
          <button
            type="button"
            className="alert-close"
            onClick={() => setMessage('')}
            aria-label="Đóng thông báo"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="alert danger" role="alert">
          <span>!</span> {error}
          <button
            type="button"
            className="alert-close"
            onClick={() => setError('')}
            aria-label="Đóng thông báo"
          >
            ×
          </button>
        </div>
      )}

      <section className="content-grid">
        <div className="panel form-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">
                {editingId ? 'UPDATE FOOD' : 'NEW FOOD'}
              </p>
              <h2>{editingId ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}</h2>
            </div>
            <span className="heading-icon">{editingId ? '✏️' : '＋'}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Mã món ăn <span>*</span>
                <input
                  name="foodId"
                  value={form.foodId}
                  onChange={handleChange}
                  placeholder="VD: FOOD004"
                  required
                />
              </label>

              <label>
                Tên món ăn <span>*</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="VD: Phở bò"
                  required
                />
              </label>

              <label>
                Danh mục <span>*</span>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="VD: Món nước"
                  required
                />
              </label>

              <label>
                Ẩm thực <span>*</span>
                <input
                  name="cuisine"
                  value={form.cuisine}
                  onChange={handleChange}
                  placeholder="VD: Việt Nam"
                  required
                />
              </label>

              <label>
                Giá bán (VNĐ) <span>*</span>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="VD: 45000"
                  min="0"
                  step="1"
                  required
                />
              </label>

              <label>
                Số lượng <span>*</span>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="VD: 20"
                  min="0"
                  step="1"
                  required
                />
              </label>

              <label className="full-width">
                Nguyên liệu
                <input
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  placeholder="Ví dụ: bánh phở, thịt bò, hành, rau thơm"
                />
                <small>Phân cách từng nguyên liệu bằng dấu phẩy.</small>
              </label>

              <label className="full-width">
                URL hình ảnh
                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/food.jpg"
                />
              </label>

              <label className="full-width">
                Mô tả
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Mô tả món ăn..."
                  rows="3"
                />
              </label>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="button primary"
                disabled={saving}
              >
                {saving
                  ? 'Đang lưu...'
                  : editingId
                    ? 'Lưu cập nhật'
                    : '+ Thêm món ăn'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="button secondary"
                  onClick={resetForm}
                >
                  Hủy sửa
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="panel list-panel">
          <div className="panel-heading list-heading">
            <div>
              <p className="section-kicker">FOOD INVENTORY</p>
              <h2>Danh sách món ăn</h2>
              <p className="muted">Dữ liệu được tải từ máy chủ.</p>
            </div>
            <span className="count-badge">{foods.length} món</span>
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <span aria-hidden="true">⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tên, mã, danh mục..."
                aria-label="Từ khóa tìm kiếm"
              />
            </div>

            <button type="submit" className="button primary search-button">
              Tìm kiếm
            </button>

            <button
              type="button"
              className="button secondary"
              onClick={() => {
                setSearch('');
                loadFoods('');
              }}
            >
              Tất cả
            </button>
          </form>

          {loading ? (
            <div className="empty-state">
              <span className="loading-spinner" />
              <p>Đang tải danh sách món ăn...</p>
            </div>
          ) : foods.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🥣</span>
              <h3>Chưa có món ăn phù hợp</h3>
              <p>Thử từ khóa khác hoặc thêm một món ăn mới.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Món ăn</th>
                    <th>Danh mục</th>
                    <th>Giá bán</th>
                    <th>SL</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {foods.map((food) => (
                    <tr key={food._id}>
                      <td>
                        <div className="food-cell">
                          {food.imageUrl ? (
                            <img
                              className="food-image"
                              src={food.imageUrl}
                              alt={food.name}
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="food-placeholder">🍲</span>
                          )}

                          <div className="food-info">
                            <strong>{food.name}</strong>
                            <small>{food.foodId}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="category-badge">
                          {food.category}
                        </span>
                      </td>

                      <td className="price-cell">
                        {formatPrice(food.price)}
                      </td>

                      <td>
                        <span
                          className={
                            Number(food.quantity) > 0
                              ? 'quantity-badge'
                              : 'quantity-badge out-of-stock'
                          }
                        >
                          {food.quantity}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="icon-button edit-button"
                            onClick={() => startEdit(food)}
                            title="Sửa món ăn"
                            aria-label={`Sửa ${food.name}`}
                          >
                            ✎
                          </button>

                          <button
                            type="button"
                            className="icon-button delete-button"
                            onClick={() => handleDelete(food)}
                            title="Xóa món ăn"
                            aria-label={`Xóa ${food.name}`}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="list-footer">
            <span>
              Đang hiển thị <strong>{foods.length}</strong> món ăn
            </span>
            <button
              type="button"
              className="refresh-button"
              onClick={() => loadFoods(search)}
            >
              ↻ Làm mới
            </button>
          </div>
        </div>
      </section>

      <footer className="page-footer">
        <span>FOOD MANAGEMENT SYSTEM</span>
        <span>React · Express · MongoDB Atlas</span>
      </footer>
    </main>
  );
}

export default App;
