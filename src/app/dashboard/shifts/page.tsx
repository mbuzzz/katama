
"use client"; 

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, LogOut, XCircle, CheckCircle, PlayCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Shift, EndShiftDialogFormData } from "@/types/shift";
import { getMockShifts } from "@/data/shifts"; // Removed endMockShift, cancelMockShift
import { endShiftAction, cancelShiftAction } from "./actions"; // Import server actions
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function ShiftsPage() {
  const [shifts, setShifts] = React.useState<Shift[]>([]);
  const [showEndShiftDialog, setShowEndShiftDialog] = React.useState(false);
  const [showCancelShiftDialog, setShowCancelShiftDialog] = React.useState(false);
  const [shiftToModify, setShiftToModify] = React.useState<Shift | null>(null);
  const [endShiftForm, setEndShiftForm] = React.useState<EndShiftDialogFormData>({ finalCashInput: 0, endNotes: "" });
  const [cancelShiftNotes, setCancelShiftNotes] = React.useState<string>("");
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const { toast } = useToast();
  const router = useRouter();

  const fetchShifts = React.useCallback(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    if (storedCompanyId) {
      setShifts(getMockShifts(storedCompanyId));
    } else {
      setShifts([]);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  const refreshShiftsAndGrid = () => {
    fetchShifts(); // Re-fetch shifts which will update the state
    router.refresh(); // May not be strictly necessary if state update re-renders, but good for ensuring data sync
  }

  const handleEndShift = async () => {
    if (!shiftToModify || !activeCompanyId) return;
    try {
      const updatedShift = await endShiftAction(shiftToModify.id, endShiftForm, activeCompanyId);
      if (updatedShift) {
        toast({
          title: "Shift Diakhiri",
          description: `Shift untuk ${updatedShift.userName} telah berhasil diakhiri.`,
        });
        refreshShiftsAndGrid();
      } else {
         throw new Error("Shift tidak ditemukan atau gagal diakhiri.");
      }
    } catch (error: any) {
      toast({
        title: "Gagal Mengakhiri Shift",
        description: error.message || "Terjadi kesalahan.",
        variant: "destructive",
      });
    }
    setShowEndShiftDialog(false);
    setShiftToModify(null);
    setEndShiftForm({ finalCashInput: 0, endNotes: "" });
  };

  const handleCancelShift = async () => {
    if (!shiftToModify || !activeCompanyId) return;
    try {
        const updatedShift = await cancelShiftAction(shiftToModify.id, activeCompanyId, cancelShiftNotes);
        if (updatedShift) {
            toast({
                title: "Shift Dibatalkan",
                description: `Shift untuk ${updatedShift.userName} telah dibatalkan.`,
            });
            refreshShiftsAndGrid();
        } else {
            throw new Error("Shift tidak ditemukan atau gagal dibatalkan.");
        }
    } catch (error: any) {
         toast({
            title: "Gagal Membatalkan Shift",
            description: error.message || "Terjadi kesalahan.",
            variant: "destructive",
        });
    }
    setShowCancelShiftDialog(false);
    setShiftToModify(null);
    setCancelShiftNotes("");
  };


  const openEndShiftDialog = (shift: Shift) => {
    setShiftToModify(shift);
    setEndShiftForm({ finalCashInput: shift.initialCash || 0, endNotes: "" }); 
    setShowEndShiftDialog(true);
  };

  const openCancelShiftDialog = (shift: Shift) => {
    setShiftToModify(shift);
    setShowCancelShiftDialog(true);
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "-";
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: idLocale });
  };
  
  const getStatusBadgeVariant = (status: Shift['status']) => {
    switch (status) {
      case 'Berjalan': return 'default'; 
      case 'Selesai': return 'secondary'; 
      case 'Dibatalkan': return 'destructive'; 
      default: return 'outline';
    }
  };


  return (
    <div>
      <PageHeader title="Manajemen Shift" description="Kelola sesi kerja kasir dan operasional outlet.">
        <Button asChild className="w-full sm:w-auto" disabled={!activeCompanyId}>
          <Link href={activeCompanyId ? "/dashboard/shifts/add" : "#"}>
            <PlayCircle className="mr-2 h-4 w-4" /> Mulai Shift Baru
          </Link>
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Shift</CardTitle>
          <CardDescription>
            Total {shifts.length} shift ditemukan {activeCompanyId ? "untuk perusahaan ini" : " (pilih perusahaan dahulu)"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead className="hidden sm:table-cell">Outlet</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead className="hidden md:table-cell">Selesai</TableHead>
                <TableHead className="hidden lg:table-cell">Durasi</TableHead>
                <TableHead className="text-right hidden md:table-cell">Modal Awal</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Kas Akhir</TableHead>
                <TableHead className="text-right hidden xl:table-cell">Total Penjualan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-10">Memuat data shift...</TableCell>
                </TableRow>
              )}
              {!isLoading && !activeCompanyId && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
                    Pilih perusahaan aktif terlebih dahulu untuk melihat data shift.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && activeCompanyId && shifts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
                    Belum ada data shift untuk perusahaan ini.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && activeCompanyId && shifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell className="font-medium max-w-[120px] truncate">{shift.userName}</TableCell>
                  <TableCell className="hidden sm:table-cell max-w-[120px] truncate">{shift.outletName}</TableCell>
                  <TableCell>{formatDate(shift.startTime)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(shift.endTime)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{shift.duration || "-"}</TableCell>
                  <TableCell className="text-right hidden md:table-cell">{formatCurrency(shift.initialCash)}</TableCell>
                  <TableCell className="text-right hidden lg:table-cell">{formatCurrency(shift.finalCash)}</TableCell>
                  <TableCell className="text-right hidden xl:table-cell">{formatCurrency(shift.totalSales)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(shift.status)}
                     className={
                        shift.status === 'Berjalan' ? "bg-blue-500 hover:bg-blue-600 text-primary-foreground" :
                        shift.status === 'Selesai' ? "bg-green-500 hover:bg-green-600 text-primary-foreground" :
                        shift.status === 'Dibatalkan' ? "bg-red-500 hover:bg-red-600 text-primary-foreground" : ""
                      }
                    >{shift.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {shift.status === 'Berjalan' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu Aksi</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi Shift</DropdownMenuLabel>
                           <DropdownMenuItem onClick={() => openEndShiftDialog(shift)}>
                            <LogOut className="mr-2 h-4 w-4" /> Akhiri Shift
                          </DropdownMenuItem>
                           <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => openCancelShiftDialog(shift)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <XCircle className="mr-2 h-4 w-4" /> Batalkan Shift
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={showEndShiftDialog} onOpenChange={setShowEndShiftDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Akhiri Shift</AlertDialogTitle>
            <AlertDialogDescription>
              Masukkan jumlah kas akhir dan catatan untuk shift <span className="font-semibold">{shiftToModify?.userName}</span> di <span className="font-semibold">{shiftToModify?.outletName}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="finalCashInput">Kas Akhir (Rp)</Label>
              <Input 
                id="finalCashInput" 
                type="number" 
                value={endShiftForm.finalCashInput}
                onChange={(e) => setEndShiftForm(prev => ({ ...prev, finalCashInput: parseFloat(e.target.value) || 0 }))}
                placeholder="Masukkan jumlah kas akhir"
              />
            </div>
            <div>
              <Label htmlFor="endNotes">Catatan Akhir Shift (Opsional)</Label>
              <Textarea 
                id="endNotes"
                value={endShiftForm.endNotes}
                onChange={(e) => setEndShiftForm(prev => ({ ...prev, endNotes: e.target.value }))}
                placeholder="Contoh: Semua transaksi cocok, sisa kembalian sesuai."
                rows={3}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShiftToModify(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndShift}>
              <CheckCircle className="mr-2 h-4 w-4" /> Ya, Akhiri Shift
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelShiftDialog} onOpenChange={setShowCancelShiftDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Batalkan Shift</AlertDialogTitle>
                <AlertDialogDescription>
                Anda yakin ingin membatalkan shift untuk <span className="font-semibold">{shiftToModify?.userName}</span> di <span className="font-semibold">{shiftToModify?.outletName}</span>?
                Tindakan ini tidak dapat diurungkan.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-2">
                <Label htmlFor="cancelNotes">Alasan Pembatalan (Opsional)</Label>
                <Textarea
                    id="cancelNotes"
                    value={cancelShiftNotes}
                    onChange={(e) => setCancelShiftNotes(e.target.value)}
                    placeholder="Contoh: Ada kendala teknis pada sistem."
                    rows={3}
                />
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShiftToModify(null)}>Tidak</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelShift} className="bg-destructive hover:bg-destructive/90">
                    <XCircle className="mr-2 h-4 w-4" /> Ya, Batalkan Shift
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
