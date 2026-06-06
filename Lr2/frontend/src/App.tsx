// Основной компонент UI: вкладки, форма, таблица контактов и inline-редактирование(прямо в таблице)
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { contactStore, ContactPayload, TabFilter } from './store/contactStore';
import styles from './App.module.css';

// инициализация формы для создания контакта
const INIT_FORM: ContactPayload = {
  name: '',
  email: '',
  phone: '',
  category: 'personal',
};

// Список табов(категорий контактов) и их отображаемых названий
const TABS: Array<{ value: TabFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'favorites', label: 'Избранное' },
  { value: 'work', label: 'Работа' },
  { value: 'personal', label: 'Личные' },
];

function App() {
  // состояние формы
  const [form, setForm] = useState<ContactPayload>(INIT_FORM);

  // состояние редактирования конкретного контакта
  const [editableId, setEditableId] = useState<number | null>(null);

  // состояние полей редактируемого контакта, хранит вводимые данные
  const [editState, setEditState] = useState<ContactPayload>(INIT_FORM);

  // состояние вкладок
  const [tabIndex, setTabIndex] = useState(0);

  //состояние для анимации свайпа, хранит в какую сторону проиграть анимацию
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right'>('right');

  // состояние ключа для перезапуска анимации
  const [swipeKey, setSwipeKey] = useState(0);

  // состояние для анимации отображения данные в таблице после загрузки
  const [contentVisible, setContentVisible] = useState(false);

  // при загрузке компонента запрашиваем контакты с backend и сохраняем их в MobX store
  useEffect(() => {
    contactStore.refresh();
  }, []);

  // анимация показа данных после загрузки
  useEffect(() => {
    if (contactStore.loading) {
      setContentVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setContentVisible(true), 200);
    return () => window.clearTimeout(timer);
  }, [contactStore.loading, contactStore.filteredContacts.length]);

  // handleField и handleEditField обновляют состояние формы и редактирования при вводе данных в инпутах
  const handleField = (key: keyof ContactPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditField = (key: keyof ContactPayload, value: string) => {
    setEditState((prev) => ({ ...prev, [key]: value }));
  };

  // addContact отправляет новый контакт на backend и сбрасывает форму
  const addContact = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    await contactStore.createContact(form);
    setForm(INIT_FORM);
  };

  // startEditing и applyEdit управляют состоянием редактирования контакта прямо в таблице
  const startEditing = (id: number) => {
    const contact = contactStore.contacts.find((item) => item.id === id);
    if (!contact) return;
    setEditableId(id);
    setEditState({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      category: contact.category,
      favorite: contact.favorite,
    });
  };

  const applyEdit = async (id: number) => {
    await contactStore.updateContact(id, {
      name: editState.name,
      email: editState.email,
      phone: editState.phone,
      category: editState.category,
      favorite: editState.favorite,
    });

    setEditableId(null);
  };

  // активный таб и направление свайп-анимации
  const switchTab = (index: number, tab: TabFilter) => {
    const direction = index > tabIndex ? 'right' : 'left';
    setSwipeDirection(direction);
    setTabIndex(index);
    contactStore.setTab(tab);
    setSwipeKey((prev) => prev + 1);
    setContentVisible(false);
    window.setTimeout(() => setContentVisible(true), 20);
  };

  // классы для активного/неактивного таба
  const classes = (tab: TabFilter) =>
    [styles.tab, contactStore.activeTab === tab ? styles.tabActive : ''].join(' ');

  // рендер
  return (
    <div className={styles.app}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Контакты</h2>
        </div>

        <div className={styles.tabsRow}>
          {TABS.map((tab, index) => (
            <button key={tab.value} onClick={() => switchTab(index, tab.value)} className={classes(tab.value)}>
              {tab.label}
            </button>
          ))}
        </div>

        
          {/* Форма для добавления нового контакта */}
          <div className={styles.formRow}>
            <input value={form.name} placeholder="Имя" className={styles.input} onChange={(e) => handleField('name', e.target.value)} />
            <input value={form.email} placeholder="Email" className={styles.input} onChange={(e) => handleField('email', e.target.value)} />
            <input value={form.phone} placeholder="Телефон" className={styles.input} onChange={(e) => handleField('phone', e.target.value)} />
            <select value={form.category} className={styles.select} onChange={(e) => handleField('category', e.target.value)}>
              <option value="personal">Личные</option>
              <option value="work">Работа</option>
            </select>
          </div>
          <div className={styles.actionRow}>
            <button className={styles.smallBtn} onClick={addContact}>Добавить</button>
          </div>


        {/* Сама таблица */}
        <div className={styles.tableWrapper}>
          <span>{contactStore.filteredContacts.length} контактов</span>
          <div key={`swipe-${swipeKey}`} className={`${styles.contentWrapper} ${contentVisible ? styles.contentVisible : ''} ${swipeDirection === 'right' ? styles.swipeRight : styles.swipeLeft}`}>

          {/* Ошибки и состояние загрузки */}
          {contactStore.error && <div className={styles.error}>{contactStore.error}</div>}
          {contactStore.loading && <div className={styles.loading}>Загрузка...</div>}

          {!contactStore.loading && contactStore.filteredContacts.length === 0 && (
            <div className={styles.noData}>Нет контактов для отображения.</div>
          )}

          {/* Наименования столбцов */}
          <div className={styles.gridTable}>
            <div className={styles.gridHeader}>ID</div>
            <div className={styles.gridHeader}>Имя</div>
            <div className={styles.gridHeader}>Email</div>
            <div className={styles.gridHeader}>Телефон</div>
            <div className={styles.gridHeader}>Категория</div>
            <div className={styles.gridHeader}>Избранное</div>
            <div className={styles.gridHeader}>Действия</div>


            {/* Строки таблица, каждая строка - контакт. Здесь во время рендера/ререндера проверяется не активированно ли состояние редактирования */}
            {contactStore.filteredContacts.map((item) => {
              const isEditing = editableId === item.id;
              return (
                <>
                  <div className={styles.gridCell} key={`id-${item.id}`}>
                    {item.id}
                  </div>
                  <div className={styles.gridCell} key={`name-${item.id}`}>
                    {isEditing ? (
                      <input className={styles.input} value={editState.name} onChange={(e) => handleEditField('name', e.target.value)} />
                    ) : (
                      item.name
                    )}
                  </div>
                  <div className={styles.gridCell} key={`email-${item.id}`}>
                    {isEditing ? (
                      <input className={styles.input} value={editState.email} onChange={(e) => handleEditField('email', e.target.value)} />
                    ) : (
                      item.email
                    )}
                  </div>
                  <div className={styles.gridCell} key={`phone-${item.id}`}>
                    {isEditing ? (
                      <input className={styles.input} value={editState.phone || ''} onChange={(e) => handleEditField('phone', e.target.value)} />
                    ) : (
                      item.phone || '-'
                    )}
                  </div>
                  <div className={styles.gridCell} key={`category-${item.id}`}>
                    {isEditing ? (
                      <select className={styles.select} value={editState.category} onChange={(e) => handleEditField('category', e.target.value)}>
                        <option value="personal">Личные</option>
                        <option value="work">Работа</option>
                      </select>
                    ) : (
                      item.category === 'work' ? 'Работа' : 'Личные'
                    )}
                  </div>
                  <div className={styles.gridCell} key={`favorite-${item.id}`}>
                    {isEditing ? (
                      <input type="checkbox" checked={!!editState.favorite} onChange={(e) => setEditState((prev) => ({ ...prev, favorite: e.target.checked }))} />
                    ) : (
                      item.favorite ? '✓' : '-'
                    )}
                  </div>
                  <div className={styles.gridCell} key={`actions-${item.id}`}>
                    {isEditing ? (
                      <>
                        <button className={styles.smallBtn} onClick={() => applyEdit(item.id)}>Сохранить</button>
                        <button className={`${styles.smallBtn} ${styles.smallBtnDanger}`} onClick={() => setEditableId(null)}>Отмена</button>
                      </>
                    ) : (
                      <>
                        <button className={styles.smallBtn} onClick={() => startEditing(item.id)}>Изменить</button>
                        <button className={`${styles.smallBtn} ${styles.smallBtnDanger}`} onClick={() => contactStore.deleteContact(item.id)}>Удалить</button>
                        <button className={styles.smallBtn} onClick={() => {
                          contactStore.updateContact(item.id, { favorite: !item.favorite });
                        }}>
                          {item.favorite ? 'Убрать из избранных' : 'В избранное'}
                        </button>
                      </>
                    )}
                  </div>
                </>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(App);

