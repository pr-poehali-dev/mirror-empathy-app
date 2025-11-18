import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Diary = {
  id: string;
  title: string;
  color: string;
  theme: string;
  createdAt: Date;
  entriesCount: number;
};

type Entry = {
  id: string;
  diaryId: string;
  content: string;
  mood: string;
  date: Date;
  diaryColor: string;
  diaryTitle: string;
};

const MOODS = ['😄', '🙂', '😐', '🙁', '😞'];

const DIARY_COLORS = [
  { name: 'Лавандовый', class: 'gradient-lavender', border: 'border-purple-300' },
  { name: 'Персиковый', class: 'gradient-peach', border: 'border-orange-300' },
  { name: 'Небесный', class: 'gradient-sky', border: 'border-blue-300' },
  { name: 'Мятный', class: 'gradient-mint', border: 'border-green-300' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('diaries');
  const [diaries, setDiaries] = useState<Diary[]>([
    {
      id: '1',
      title: 'Личный дневник',
      color: 'gradient-lavender',
      theme: 'семья, отношения',
      createdAt: new Date(),
      entriesCount: 5,
    },
  ]);
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: '1',
      diaryId: '1',
      content: 'Сегодня был тёплый осенний день. Гуляла в парке и думала о том, как важно ценить простые моменты.',
      mood: '🙂',
      date: new Date(),
      diaryColor: 'gradient-lavender',
      diaryTitle: 'Личный дневник',
    },
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateDiaryOpen, setIsCreateDiaryOpen] = useState(false);
  const [isCreateEntryOpen, setIsCreateEntryOpen] = useState(false);
  const [diaryToDelete, setDiaryToDelete] = useState<string | null>(null);
  const [newDiary, setNewDiary] = useState({ title: '', theme: '', color: 'gradient-lavender' });
  const [newEntry, setNewEntry] = useState({ content: '', mood: '🙂', diaryId: '' });

  const handleCreateDiary = () => {
    if (!newDiary.title.trim()) {
      toast.error('Введите название дневника');
      return;
    }

    const diary: Diary = {
      id: Date.now().toString(),
      title: newDiary.title,
      color: newDiary.color,
      theme: newDiary.theme,
      createdAt: new Date(),
      entriesCount: 0,
    };

    setDiaries([...diaries, diary]);
    setNewDiary({ title: '', theme: '', color: 'gradient-lavender' });
    setIsCreateDiaryOpen(false);
    toast.success('Дневник создан!');
  };

  const handleDeleteDiary = (diaryId: string) => {
    const diary = diaries.find(d => d.id === diaryId);
    if (!diary) return;

    setEntries(entries.filter(e => e.diaryId !== diaryId));
    setDiaries(diaries.filter(d => d.id !== diaryId));
    setDiaryToDelete(null);
    toast.success(`Дневник "${diary.title}" удалён`);
  };

  const handleCreateEntry = () => {
    if (!newEntry.content.trim()) {
      toast.error('Введите текст записи');
      return;
    }
    if (!newEntry.diaryId) {
      toast.error('Выберите дневник');
      return;
    }

    const diary = diaries.find(d => d.id === newEntry.diaryId);
    if (!diary) return;

    const entry: Entry = {
      id: Date.now().toString(),
      diaryId: newEntry.diaryId,
      content: newEntry.content,
      mood: newEntry.mood,
      date: selectedDate,
      diaryColor: diary.color,
      diaryTitle: diary.title,
    };

    setEntries([...entries, entry]);
    setDiaries(diaries.map(d => 
      d.id === newEntry.diaryId ? { ...d, entriesCount: d.entriesCount + 1 } : d
    ));
    setNewEntry({ content: '', mood: '🙂', diaryId: '' });
    setIsCreateEntryOpen(false);
    toast.success('Запись добавлена!');
  };

  const todayEntries = entries.filter(
    entry => entry.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-md mx-auto px-4 py-6 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-1">Mirror.Me</h1>
          <p className="text-sm text-muted-foreground">Эмоциональный дневник</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="diaries" className="flex items-center gap-2">
              <Icon name="BookOpen" size={16} />
              Дневники
            </TabsTrigger>
            <TabsTrigger value="day" className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              День
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diaries" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Мои дневники</h2>
              <Dialog open={isCreateDiaryOpen} onOpenChange={setIsCreateDiaryOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Icon name="Plus" size={16} />
                    Создать
                  </Button>
                </DialogTrigger>
                <DialogContent className="animate-scale-in">
                  <DialogHeader>
                    <DialogTitle>Новый дневник</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Название</Label>
                      <Input
                        id="title"
                        placeholder="Например: Сердце и работа"
                        value={newDiary.title}
                        onChange={(e) => setNewDiary({ ...newDiary, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="theme">Тематика</Label>
                      <Input
                        id="theme"
                        placeholder="семья, отношения, терапия..."
                        value={newDiary.theme}
                        onChange={(e) => setNewDiary({ ...newDiary, theme: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Цвет дневника</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {DIARY_COLORS.map((color) => (
                          <button
                            key={color.class}
                            onClick={() => setNewDiary({ ...newDiary, color: color.class })}
                            className={`h-12 rounded-lg ${color.class} border-2 transition-all ${
                              newDiary.color === color.class ? 'border-primary scale-105' : 'border-transparent'
                            }`}
                          >
                            <span className="text-xs font-medium">{color.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleCreateDiary} className="w-full">
                    Создать дневник
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {diaries.map((diary) => (
                <Card
                  key={diary.id}
                  className={`p-4 hover:shadow-lg transition-all animate-fade-in border-none ${diary.color}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{diary.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{diary.theme}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="FileText" size={12} />
                          {diary.entriesCount} записей
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDiaryToDelete(diary.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <AlertDialog open={!!diaryToDelete} onOpenChange={() => setDiaryToDelete(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить дневник?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Все записи из этого дневника будут удалены. Это действие нельзя отменить.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => diaryToDelete && handleDeleteDiary(diaryToDelete)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          <TabsContent value="day" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {todayEntries.length} {todayEntries.length === 1 ? 'запись' : 'записей'}
                </p>
              </div>
              <Dialog open={isCreateEntryOpen} onOpenChange={setIsCreateEntryOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Icon name="Plus" size={16} />
                    Записать
                  </Button>
                </DialogTrigger>
                <DialogContent className="animate-scale-in">
                  <DialogHeader>
                    <DialogTitle>Новая запись</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Дневник</Label>
                      <select
                        className="w-full p-2 border rounded-lg"
                        value={newEntry.diaryId}
                        onChange={(e) => setNewEntry({ ...newEntry, diaryId: e.target.value })}
                      >
                        <option value="">Выберите дневник</option>
                        {diaries.map((diary) => (
                          <option key={diary.id} value={diary.id}>
                            {diary.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Настроение</Label>
                      <div className="flex gap-2">
                        {MOODS.map((mood) => (
                          <button
                            key={mood}
                            onClick={() => setNewEntry({ ...newEntry, mood })}
                            className={`text-3xl p-2 rounded-lg transition-all ${
                              newEntry.mood === mood ? 'bg-primary/10 scale-110' : 'hover:bg-muted'
                            }`}
                          >
                            {mood}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Запись</Label>
                      <Textarea
                        id="content"
                        placeholder="Расскажите, как прошёл день..."
                        rows={6}
                        className="font-diary resize-none"
                        value={newEntry.content}
                        onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateEntry} className="w-full">
                    Сохранить запись
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            {todayEntries.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Icon name="BookOpen" size={48} className="opacity-30" />
                  <p>Пока нет записей за этот день</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {todayEntries.map((entry) => (
                  <Card
                    key={entry.id}
                    className={`p-4 animate-fade-in border-l-4 ${entry.diaryColor}`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl">{entry.mood}</span>
                      <div className="flex-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {entry.diaryTitle}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-diary leading-relaxed">{entry.content}</p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="ghost" size="sm" className="text-xs gap-1">
                        <Icon name="Sparkles" size={14} />
                        Попросить комментарий AI
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}