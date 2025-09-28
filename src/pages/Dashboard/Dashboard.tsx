import type {User} from "@supabase/supabase-js";
import {LogOut, PlusCircle, Trash2, RefreshCw, Loader2} from "lucide-react";
import {useState, useEffect, useCallback} from "react";
import {toast} from "sonner";

import apiClient from "@/api";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {supabase} from "@/supabaseClient";

interface WishlistItem {
  id: string;
  nome: string;
  valor: number;
  link: string;
}

export function Dashboard() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [newItemName, setNewItemName] = useState("");
  const [newItemValue, setNewItemValue] = useState("");
  const [newItemLink, setNewItemLink] = useState("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<WishlistItem | null>(null);

  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editLink, setEditLink] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{items: WishlistItem[]}>("/lista-desejos");
      const formattedItems = response.data.items.map(item => ({...item, valor: item.valor / 100}));
      setItems(formattedItems);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadUserAndItems = async () => {
      try {
        const {data: {user: fetchedUser}} = await supabase.auth.getUser();
        setUser(fetchedUser);
        await fetchItems();
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      }
    };

    void loadUserAndItems();
  }, [fetchItems]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post("/lista-desejos/adicionar", {
        nome: newItemName,
        valor: parseFloat(newItemValue),
        link: newItemLink,
      });
      setNewItemName("");
      setNewItemValue("");
      setNewItemLink("");
      setIsAddItemDialogOpen(false);
      await fetchItems();
      toast.success("Item adicionado com sucesso!");
    } catch {
      toast.error("Erro ao adicionar o item");
    }
  };

  const handleOpenDeleteDialog = (itemId: string) => {
    setItemToDelete(itemId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) {
      return;
    }

    try {
      await apiClient.delete(`/lista-desejos/${itemToDelete}`);
      await fetchItems();
      toast.success("Item deletado com sucesso!");
    } catch {
      toast.error("Erro ao deletar o item");
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) {
      setItemToDelete(null);
    }
  };

  const handleOpenEditDialog = (item: WishlistItem) => {
    setItemToEdit(item);
    setEditName(item.nome);
    setEditValue(item.valor.toString());
    setEditLink(item.link);
    setIsEditDialogOpen(true);
  };

  const handleConfirmEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!itemToEdit) {
      return;
    }

    const formData = new FormData(e.currentTarget);

    const nome = formData.get("edit-name") as string;
    const valor = formData.get("edit-value") as string;
    const link = formData.get("edit-link") as string;

    try {
      await apiClient.put(`/lista-desejos/${itemToEdit.id}`, {
        nome: nome,
        valor: parseFloat(valor),
        link: link,
      });
      setIsEditDialogOpen(false);
      setItemToEdit(null);
      await fetchItems();
      toast.success("Item atualizado com sucesso!");
    } catch {
      toast.error("Erro ao atualizar o item");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sua Lista de Desejos</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        <Button className="cursor-pointer" variant="ghost" size="sm" onClick={() => void supabase.auth.signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </header>

      <main>
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">
            Você tem
            {" "}
            {items.length}
            {" "}
            item(s) na sua lista.
          </p>
          <div className="flex gap-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => {
                void fetchItems();
              }}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>

            <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
              <DialogTrigger asChild>
                <Button className="cursor-pointer" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Item</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes do produto que você deseja.
                  </DialogDescription>
                </DialogHeader>
                <form
                  id="add-item-form"
                  onSubmit={(e) => {
                    void handleAddItem(e);
                  }}
                >
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Nome</Label>
                      <Input
                        id="name"
                        value={newItemName}
                        onChange={(e) => {
                          setNewItemName(e.target.value);
                        }}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="value" className="text-right">Valor</Label>
                      <Input
                        id="value"
                        type="number"
                        value={newItemValue}
                        onChange={(e) => {
                          setNewItemValue(e.target.value);
                        }}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="link" className="text-right">Link</Label>
                      <Input
                        id="link"
                        type="url"
                        value={newItemLink}
                        onChange={(e) => {
                          setNewItemLink(e.target.value);
                        }}
                        className="col-span-3"
                        required
                      />
                    </div>
                  </div>
                </form>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button className="cursor-pointer" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button className="cursor-pointer" type="submit" form="add-item-form">Salvar Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="w-[150px]">Valor</TableHead>
                <TableHead className="w-[150px] text-center">Link</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  )
                : items.length > 0
                  ? (
                      items.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.nome}</TableCell>
                          <TableCell>{item.valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}</TableCell>
                          <TableCell className="text-center">
                            <Button asChild variant="link">
                              <a href={item.link} target="_blank" rel="noopener noreferrer">Ver Produto</a>
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              className="cursor-pointer"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                handleOpenDeleteDialog(item.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            <Button
                              className="cursor-pointer"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                handleOpenEditDialog(item);
                              }}
                            >
                              ✏️
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )
                  : (
                      <TableRow><TableCell colSpan={4} className="text-center h-24">Sua lista está vazia.</TableCell></TableRow>
                    )}
            </TableBody>
          </Table>
        </div>
      </main>

      <Dialog open={isDeleteDialogOpen} onOpenChange={handleCancelDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita. Isso deletará permanentemente o
              item da sua lista de desejos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="cursor-pointer" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={() => void handleConfirmDelete()}
            >
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
            <DialogDescription>Atualize os detalhes do item.</DialogDescription>
          </DialogHeader>
          <form id="edit-item-form" onSubmit={e => void handleConfirmEdit(e)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Nome</Label>
                <Input
                  id="edit-name"
                  name="edit-name"
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                  }}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-value" className="text-right">Valor</Label>
                <Input
                  id="edit-value"
                  name="edit-value"
                  type="number"
                  value={editValue}
                  onChange={(e) => {
                    setEditValue(e.target.value);
                  }}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-link" className="text-right">Link</Label>
                <Input
                  id="edit-link"
                  name="edit-link"
                  type="url"
                  value={editLink}
                  onChange={(e) => {
                    setEditLink(e.target.value);
                  }}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="cursor-pointer" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button className="cursor-pointer" type="submit" form="edit-item-form">Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
