'use client';

import { useEffect, useState } from 'react';
import { RichTextEditor } from './RichTextEditor';

type Language = { id: string; code: string; name: string; isDefault: boolean };
type ContentType = 'PRODUCT' | 'ARTICLE' | 'BLOG';

type TranslationForm = { languageId: string; slug: string; title: string; description: string; bodyHtml: string };

const blankTranslation: TranslationForm = { languageId: '', slug: '', title: '', description: '', bodyHtml: '<p></p>' };

export function AdminClient() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [form, setForm] = useState({ type: 'PRODUCT' as ContentType, category: '', imageUrl: '', publishedAt: '' });
  const [translations, setTranslations] = useState<TranslationForm[]>([blankTranslation]);
  const [contentList, setContentList] = useState<any[]>([]);

  async function load() {
    const [langRes, setRes, contentRes] = await Promise.all([fetch('/api/languages'), fetch('/api/site-settings'), fetch('/api/content')]);
    setLanguages(await langRes.json());
    setSettings(await setRes.json());
    setContentList(await contentRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function addLanguage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch('/api/languages', {
      method: 'POST',
      body: JSON.stringify({ code: fd.get('code'), name: fd.get('name'), isDefault: fd.get('isDefault') === 'on' })
    });
    e.currentTarget.reset();
    load();
  }

  async function createContent(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/content', {
      method: 'POST',
      body: JSON.stringify({ ...form, translations })
    });
    alert('İçerik kaydedildi');
    setTranslations([blankTranslation]);
    load();
  }

  async function upload(file?: File | null, onDone?: (url: string) => void) {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    onDone?.(data.url);
  }


  async function removeContent(id: string) {
    await fetch(`/api/content/${id}`, { method: 'DELETE' });
    load();
  }

  async function saveSetting(key: string, languageId: string, value: string) {
    await fetch('/api/site-settings', { method: 'POST', body: JSON.stringify({ key, languageId, value }) });
    load();
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      <h1>Admin Panel</h1>
      <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
        <section className="card">
          <h2>Diller</h2>
          <form onSubmit={addLanguage} style={{ display: 'grid', gap: '.6rem' }}>
            <input name="name" placeholder="Dil Adı" required />
            <input name="code" placeholder="Kod (örn: de)" required />
            <label><input type="checkbox" name="isDefault" /> Varsayılan yap</label>
            <button type="submit">Dil Ekle</button>
          </form>
          <ul>{languages.map((l) => <li key={l.id}>{l.name} ({l.code}) {l.isDefault ? '• default' : ''}</li>)}</ul>
        </section>

        <section className="card">
          <h2>Site Metinleri</h2>
          {settings.map((setting) => (
            <div key={setting.key} style={{ marginBottom: '.8rem' }}>
              <strong>{setting.key}</strong>
              {languages.map((lang) => {
                const existing = setting.translations.find((x: any) => x.languageId === lang.id)?.value ?? '';
                return (
                  <div key={lang.id} style={{ marginTop: '.4rem' }}>
                    <label>{lang.name}</label>
                    <textarea defaultValue={existing} onBlur={(e) => saveSetting(setting.key, lang.id, e.target.value)} />
                  </div>
                );
              })}
            </div>
          ))}
        </section>

        <section className="card">
          <h2>Ürün / Makale / Blog Oluştur</h2>
          <form onSubmit={createContent} style={{ display: 'grid', gap: '.7rem' }}>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ContentType })}>
              <option value="PRODUCT">Ürün</option>
              <option value="ARTICLE">Makale</option>
              <option value="BLOG">Blog</option>
            </select>
            <input placeholder="Kategori" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input type="datetime-local" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
            <input placeholder="Görsel URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0], (url) => setForm({ ...form, imageUrl: url }))} />
            {translations.map((t, idx) => (
              <div key={idx} className="card" style={{ background: '#f8fafc' }}>
                <select value={t.languageId} onChange={(e) => setTranslations((prev) => prev.map((row, i) => i === idx ? { ...row, languageId: e.target.value } : row))}>
                  <option value="">Dil seç</option>
                  {languages.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                <input placeholder="Slug" value={t.slug} onChange={(e) => setTranslations((prev) => prev.map((row, i) => i === idx ? { ...row, slug: e.target.value } : row))} />
                <input placeholder="Başlık" value={t.title} onChange={(e) => setTranslations((prev) => prev.map((row, i) => i === idx ? { ...row, title: e.target.value } : row))} />
                <textarea placeholder="Açıklama" value={t.description} onChange={(e) => setTranslations((prev) => prev.map((row, i) => i === idx ? { ...row, description: e.target.value } : row))} />
                <RichTextEditor value={t.bodyHtml} onChange={(html) => setTranslations((prev) => prev.map((row, i) => i === idx ? { ...row, bodyHtml: html } : row))} />
              </div>
            ))}
            <button type="button" className="secondary" onClick={() => setTranslations((prev) => [...prev, blankTranslation])}>Çeviri Ekle</button>
            <button type="submit">Kaydet</button>
          </form>
        </section>


        <section className="card">
          <h2>İçerik Listesi</h2>
          <div className="grid">
            {contentList.map((item) => (
              <div key={item.id} className="card" style={{ background: '#f8fafc' }}>
                <strong>{item.type}</strong> - {item.category || 'Kategorisiz'}
                <ul>
                  {item.translations.map((t: any) => <li key={t.id}>{t.language.code}: {t.title} ({t.slug})</li>)}
                </ul>
                <button type="button" className="secondary" onClick={() => removeContent(item.id)}>Sil</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
