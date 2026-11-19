"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wrench,
  Truck,
  Plus,
  Search,
  Filter,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Edit,
  Trash2,
  X,
  Save,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  FileText,
  Activity,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import {
  EquipmentItem,
  FLEET,
  getStoredFleet,
  saveStoredFleet,
} from "@/lib/fleet";
import { showConfirm, showAlert, showSuccess } from "@/lib/swal";

export default function FleetPricingPage() {
  const [fleetList, setFleetList] = useState<EquipmentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);

  // Active photo viewed on fleet list cards
  const [cardPhotoMap, setCardPhotoMap] = useState<Record<string, string>>({});

  // Preset machines for quick loading angles in modal
  const PRESET_MACHINES = [
    {
      label: "Cat 226D3 (5 Angles)",
      images: [
        "/images/equipments/2021 Cat 226D3/1.jpg",
        "/images/equipments/2021 Cat 226D3/2.jpg",
        "/images/equipments/2021 Cat 226D3/3.jpg",
        "/images/equipments/2021 Cat 226D3/4.jpg",
        "/images/equipments/2021 Cat 226D3/5.jpg",
      ],
      cover: "/images/equipments/2021 Cat 226D3/1.jpg",
    },
    {
      label: "CAT 259D3 (4 Angles)",
      images: [
        "/images/cat-ontrailer.webp",
        "/images/cat-front.webp",
        "/images/cat-side.webp",
        "/images/cat-back.webp",
      ],
      cover: "/images/cat-ontrailer.webp",
    },
    {
      label: "John Deere (1 Photo)",
      images: ["/images/jd-4044.webp"],
      cover: "/images/jd-4044.webp",
    },
    {
      label: "Water Trailer (1 Photo)",
      images: ["/images/water-trailer.webp"],
      cover: "/images/water-trailer.webp",
    },
  ];

  // Drag and Drop & Multiple Images State
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState("");

  // Process multiple dropped or selected files
  const handleProcessFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const validFiles = fileArray.filter((file) => {
      if (!file.type.startsWith("image/")) {
        showAlert({
          title: "Invalid File Type",
          text: `"${file.name}" is not an image file (PNG, JPG, WEBP).`,
          icon: "warning",
        });
        return false;
      }
      if (file.size > 12 * 1024 * 1024) {
        showAlert({
          title: "File Too Large",
          text: `"${file.name}" exceeds 12MB. Please select a smaller photo.`,
          icon: "warning",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    let loadedCount = 0;
    const newImages: string[] = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          newImages.push(dataUrl);
        }
        loadedCount++;
        if (loadedCount === validFiles.length) {
          setFormData((prev) => {
            const currentList = prev.images && prev.images.length > 0 ? prev.images : prev.imageUrl ? [prev.imageUrl] : [];
            const combined = [...currentList, ...newImages];
            return {
              ...prev,
              images: combined,
              imageUrl: prev.imageUrl || combined[0] || "",
            };
          });
          showToast(`Added ${newImages.length} photo${newImages.length > 1 ? "s" : ""} to equipment gallery!`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Set primary cover photo
  const setPrimaryCoverImage = (imgSrc: string) => {
    setFormData((prev) => {
      const currentList = prev.images || (prev.imageUrl ? [prev.imageUrl] : []);
      const remaining = currentList.filter((img) => img !== imgSrc);
      const reordered = [imgSrc, ...remaining];
      return {
        ...prev,
        imageUrl: imgSrc,
        images: reordered,
      };
    });
    showToast("Cover photo updated!");
  };

  // Remove photo from gallery
  const removeGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const currentList = prev.images || (prev.imageUrl ? [prev.imageUrl] : []);
      const updatedImages = currentList.filter((_, idx) => idx !== indexToRemove);
      const nextPrimary =
        prev.imageUrl === currentList[indexToRemove]
          ? updatedImages[0] || ""
          : prev.imageUrl;
      return {
        ...prev,
        images: updatedImages,
        imageUrl: nextPrimary,
      };
    });
    showToast("Photo removed from gallery.");
  };

  // Add photo via manual URL input
  const handleAddManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    const url = manualUrlInput.trim();
    setFormData((prev) => {
      const currentList = prev.images || (prev.imageUrl ? [prev.imageUrl] : []);
      if (currentList.includes(url)) {
        showAlert({
          title: "Duplicate Photo",
          text: "This image URL is already in the equipment gallery.",
          icon: "info",
        });
        return prev;
      }
      const updated = [...currentList, url];
      return {
        ...prev,
        images: updated,
        imageUrl: prev.imageUrl || url,
      };
    });
    setManualUrlInput("");
    showToast("Added photo URL to equipment gallery!");
  };

  // Default empty form for new equipment
  const emptyEquipment: EquipmentItem = {
    id: "",
    name: "",
    slug: "",
    category: "Track Loader",
    tagline: "",
    description: "",
    dailyRate: 350,
    weeklyRate: 1100,
    monthlyRate: 2800,
    weekendRate: 550,
    overtimeRate: 75,
    includedHours: "8 hrs/day • 40 hrs/wk • 160 hrs/mo",
    engineSpecs: "Tier 4 Diesel Engine",
    operatingWeight: "8,500 lb",
    keyFeatures: ["Standard Heavy-Duty Dirt Bucket", "Quick-Coupler Hydraulics"],
    requiresAZ811: true,
    imageUrl: "/images/cat-ontrailer.webp",
    images: ["/images/cat-ontrailer.webp"],
    status: "available",
    serialNumber: "AZR-" + Math.floor(1000 + Math.random() * 9000),
    engineHours: 120.5,
    nextServiceHours: 250,
  };

  const [formData, setFormData] = useState<EquipmentItem>(emptyEquipment);

  // Load stored fleet on client mount
  useEffect(() => {
    const list = getStoredFleet();
    // Default statuses if not present
    const initialized = list.map((item, idx) => ({
      ...item,
      status: item.status || (idx % 2 === 0 ? "available" : "rented"),
      serialNumber: item.serialNumber || `AZR-202${idx + 1}-0${idx + 7}`,
      engineHours: item.engineHours || Math.floor(180 + idx * 75 + 14.5),
      nextServiceHours: item.nextServiceHours || 250,
      weekendRate: item.weekendRate || Math.round(item.dailyRate * 1.6),
      images: item.images && item.images.length > 0 ? item.images : [item.imageUrl],
    }));
    setFleetList(initialized);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open modal for adding a brand-new machine
  const handleAddNew = () => {
    const newId = "eq-" + Date.now().toString().slice(-4);
    setEditingItem(null);
    setFormData({
      ...emptyEquipment,
      id: newId,
      slug: `new-machine-${newId}`,
      serialNumber: "AZR-" + Math.floor(1000 + Math.random() * 9000),
      images: [emptyEquipment.imageUrl],
      imageUrl: emptyEquipment.imageUrl,
    });
    setManualUrlInput("");
    setIsModalOpen(true);
  };

  // Open modal for editing an existing machine
  const handleEdit = (item: EquipmentItem) => {
    setEditingItem(item);
    const existingImages =
      item.images && item.images.length > 0
        ? [...item.images]
        : item.imageUrl
        ? [item.imageUrl]
        : [];
    setFormData({
      ...item,
      images: existingImages,
      imageUrl: item.imageUrl || existingImages[0] || "",
    });
    setManualUrlInput("");
    setIsModalOpen(true);
  };

  // Save changes (create or update)
  const handleSaveEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dailyRate) {
      showAlert({
        title: "Missing Required Fields",
        text: "Please provide at least a Machine Name and a Daily Rate before saving.",
        icon: "warning",
      });
      return;
    }

    const finalImages =
      formData.images && formData.images.length > 0
        ? formData.images
        : formData.imageUrl
        ? [formData.imageUrl]
        : ["/images/cat-ontrailer.webp"];
    const finalCover = formData.imageUrl || finalImages[0];

    const preparedData: EquipmentItem = {
      ...formData,
      imageUrl: finalCover,
      images: finalImages,
    };

    let updated: EquipmentItem[];
    if (editingItem) {
      // Update existing
      updated = fleetList.map((m) => (m.id === preparedData.id ? { ...preparedData } : m));
      showToast(`Updated "${preparedData.name}" rates & specifications!`);
    } else {
      // Add new
      updated = [preparedData, ...fleetList];
      showToast(`Added new machine "${preparedData.name}" to the fleet!`);
    }

    setFleetList(updated);
    saveStoredFleet(updated);
    setIsModalOpen(false);
  };

  // Quick inline status changer
  const handleQuickStatusChange = (
    id: string,
    newStatus: EquipmentItem["status"]
  ) => {
    const updated = fleetList.map((m) =>
      m.id === id ? { ...m, status: newStatus } : m
    );
    setFleetList(updated);
    saveStoredFleet(updated);
    showToast(`Status updated to ${newStatus?.toUpperCase()}!`);
  };

  // Quick inline daily rate changer
  const handleQuickRateChange = (id: string, delta: number) => {
    const updated = fleetList.map((m) => {
      if (m.id === id) {
        const newDaily = Math.max(50, m.dailyRate + delta);
        const newWeekly = Math.round(newDaily * 2.9);
        const newMonthly = Math.round(newDaily * 7.0);
        return {
          ...m,
          dailyRate: newDaily,
          weeklyRate: newWeekly,
          monthlyRate: newMonthly,
        };
      }
      return m;
    });
    setFleetList(updated);
    saveStoredFleet(updated);
    showToast("Rental rates adjusted and synced!");
  };

  // Delete machine with SweetAlert Modal
  const handleDelete = async (id: string, name: string) => {
    const res = await showConfirm({
      title: "Delete Equipment?",
      text: `Are you sure you want to delete "${name}" from the active fleet? This unit will be removed from inventory and dispatch.`,
      icon: "warning",
      confirmButtonText: "Yes, delete unit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#DC2626",
    });

    if (res.isConfirmed) {
      const updated = fleetList.filter((m) => m.id !== id);
      setFleetList(updated);
      saveStoredFleet(updated);
      showToast(`Deleted "${name}" from fleet records.`);
    }
  };

  // Reset to original default fleet with SweetAlert Modal
  const handleResetFleet = async () => {
    const res = await showConfirm({
      title: "Reset Fleet to Defaults?",
      text: "This will restore original factory machines and standard pricing. Any custom added units will be cleared.",
      icon: "warning",
      confirmButtonText: "Yes, reset defaults",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#DC2626",
    });

    if (res.isConfirmed) {
      setFleetList(FLEET);
      saveStoredFleet(FLEET);
      showToast("Fleet and pricing reset to factory defaults!");
    }
  };

  // Filtered list
  const filteredFleet = fleetList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.serialNumber && item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.engineSpecs.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate metrics
  const totalMachines = fleetList.length;
  const availableCount = fleetList.filter((m) => m.status === "available").length;
  const rentedCount = fleetList.filter((m) => m.status === "rented").length;
  const maintenanceCount = fleetList.filter((m) => m.status === "maintenance").length;
  const totalDailyPotential = fleetList.reduce((acc, curr) => acc + curr.dailyRate, 0);

  return (
    <div className="space-y-6 pb-12 font-sans text-gray-900">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-red-600 text-white font-bold px-4 py-2.5 rounded shadow-xl text-sm flex items-center gap-2 border border-yellow-400 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER WITH UNIFORM H-10 RED ACTION BUTTONS */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider bg-yellow-400 text-gray-950 px-2 py-0.5 rounded">
              Fleet Management
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Cave Creek Depot Yard • Heavy Equipment Inventory
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-red-600" />
            Equipment & Rental Pricing Manager
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Control machine specifications, daily/weekly rental rates, engine hour meters, and yard availability.
          </p>
        </div>

        {/* RED ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetFleet}
            className="h-10 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3.5 rounded text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer border border-gray-300 active:scale-[0.98]"
            title="Reset fleet back to original factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-600" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleAddNew}
            className="h-10 bg-red-600 hover:bg-red-700 text-white font-bold px-4 rounded text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add New Machine</span>
          </button>
        </div>
      </div>

      {/* 4 KPI METRIC CARDS (POINTER HOVER ANIMATIONS LIKE DASHBOARD) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL FLEET */}
        <div
          onClick={() => {
            setSelectedStatus("all");
            setSelectedCategory("all");
          }}
          className="bg-white border-2 border-gray-200 p-4 rounded-lg shadow-xs cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg active:scale-[0.98] hover:border-yellow-500"
          title="Click to view all machines"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Total Fleet Units
            </span>
            <Truck className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
            {totalMachines} Units
          </div>
          <span className="text-xs font-bold text-gray-600 block mt-1">
            Active in Cave Creek yard
          </span>
        </div>

        {/* AVAILABLE IN YARD */}
        <div
          onClick={() => setSelectedStatus("available")}
          className={`bg-white border-2 p-4 rounded-lg shadow-xs cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg active:scale-[0.98] ${
            selectedStatus === "available"
              ? "border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-600/20"
              : "border-gray-200 hover:border-emerald-500"
          }`}
          title="Click to filter Available units"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Ready to Rent (In Yard)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            {availableCount} Units
          </div>
          <span className="text-xs font-bold text-emerald-700 block mt-1">
            Prepped for immediate delivery
          </span>
        </div>

        {/* RENTED / ON-SITE */}
        <div
          onClick={() => setSelectedStatus("rented")}
          className={`bg-white border-2 p-4 rounded-lg shadow-xs cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg active:scale-[0.98] ${
            selectedStatus === "rented"
              ? "border-blue-600 bg-blue-50/20 ring-2 ring-blue-600/20"
              : "border-gray-200 hover:border-blue-500"
          }`}
          title="Click to filter Rented units"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Currently on Jobsite
            </span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-1">
            {rentedCount} Units
          </div>
          <span className="text-xs font-bold text-blue-700 block mt-1">
            Earning daily rental revenue
          </span>
        </div>

        {/* DAILY REVENUE CAPACITY */}
        <div className="bg-white border-2 border-gray-200 hover:border-yellow-500 p-4 rounded-lg shadow-xs cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg active:scale-[0.98]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Daily Fleet Earning Power
            </span>
            <DollarSign className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
            ${totalDailyPotential.toLocaleString()}
            <span className="text-xs text-gray-500 font-bold">/day</span>
          </div>
          <span className="text-xs font-bold text-yellow-800 block mt-1">
            100% full fleet book capacity
          </span>
        </div>
      </div>

      {/* SEARCH AND CATEGORY FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* SEARCH INPUT */}
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search machine name, serial #, specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* STATUS FILTER DROPDOWN */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-300 rounded text-xs font-bold bg-white text-gray-900 focus:outline-none focus:border-red-600 cursor-pointer"
          >
            <option value="all">All Statuses ({fleetList.length})</option>
            <option value="available">Available in Yard ({availableCount})</option>
            <option value="rented">Rented / On-Site ({rentedCount})</option>
            <option value="maintenance">Maintenance ({maintenanceCount})</option>
          </select>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          {[
            { id: "all", label: "All Categories" },
            { id: "Track Loader", label: "Track Loaders" },
            { id: "Skid Steer", label: "Skid Steers" },
            { id: "Utility Tractor", label: "Tractors" },
            { id: "Heavy Trailer", label: "Heavy Trailers" },
            { id: "Water Trailer", label: "Water Trailers" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* EQUIPMENT INVENTORY CARDS GRID (ANIMATED HOVER & FAST ACTIONS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredFleet.map((machine) => {
          const statusColors: Record<
            string,
            { bg: string; text: string; dot: string; label: string }
          > = {
            available: {
              bg: "bg-emerald-50 border-emerald-300",
              text: "text-emerald-800",
              dot: "bg-emerald-600",
              label: "Available in Yard",
            },
            rented: {
              bg: "bg-blue-50 border-blue-300",
              text: "text-blue-800",
              dot: "bg-blue-600",
              label: "Rented / On-Site",
            },
            maintenance: {
              bg: "bg-red-50 border-red-300",
              text: "text-red-800",
              dot: "bg-red-600",
              label: "Service Due / Repair",
            },
            reserved: {
              bg: "bg-yellow-50 border-yellow-300",
              text: "text-yellow-800",
              dot: "bg-yellow-500",
              label: "48-Hr Hold Reserved",
            },
          };

          const curStatus = statusColors[machine.status || "available"] || statusColors.available;

          return (
            <div
              key={machine.id}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-xs transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg hover:border-yellow-500 flex flex-col justify-between"
            >
              <div>
                {/* CARD HEADER & THUMBNAIL */}
                <div className="relative h-44 bg-gray-100 overflow-hidden border-b border-gray-200 group">
                  <img
                    src={cardPhotoMap[machine.id] || machine.imageUrl}
                    alt={machine.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-gray-950/85 backdrop-blur-xs text-white px-2 py-0.5 rounded shadow-xs">
                      {machine.category}
                    </span>
                    {machine.requiresAZ811 && (
                      <span className="text-[10px] font-black bg-yellow-500 text-gray-950 px-1.5 py-0.5 rounded shadow-xs">
                        AZ 811 Required
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-xs font-mono font-bold bg-white/90 text-gray-900 px-2 py-0.5 rounded shadow-xs border border-gray-300">
                      {machine.serialNumber || machine.id}
                    </span>
                  </div>

                  {/* PRICE BANNER OVER IMAGE */}
                  <div className="absolute bottom-2 left-2.5 bg-gray-950/90 backdrop-blur-xs text-white px-2.5 py-1 rounded shadow-md flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-yellow-400">
                      ${machine.dailyRate}
                    </span>
                    <span className="text-[11px] text-gray-300 font-bold">/day</span>
                    <span className="text-[11px] text-gray-400 font-normal ml-1">
                      (${machine.weeklyRate}/wk)
                    </span>
                  </div>

                  {/* MULTI-PHOTO BADGE & ANGLE DOTS */}
                  {machine.images && machine.images.length > 1 && (
                    <div className="absolute bottom-2 right-2.5 flex items-center gap-1.5 bg-gray-950/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded shadow-xs border border-white/20">
                      <ImageIcon className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                      <span>{machine.images.length} Photos</span>
                      <div className="flex items-center gap-1 ml-1 pl-1 border-l border-white/30">
                        {machine.images.slice(0, 5).map((img, imgIdx) => {
                          const isCur = (cardPhotoMap[machine.id] || machine.imageUrl) === img;
                          return (
                            <button
                              key={imgIdx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardPhotoMap((prev) => ({ ...prev, [machine.id]: img }));
                              }}
                              className={`w-2 h-2 rounded-full transition-transform cursor-pointer ${
                                isCur ? "bg-yellow-400 scale-125" : "bg-white/50 hover:bg-white"
                              }`}
                              title={`View Angle ${imgIdx + 1}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* MACHINE BODY INFO */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-base font-black text-gray-950 tracking-tight leading-snug">
                      {machine.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium line-clamp-1 mt-0.5">
                      {machine.tagline || machine.description}
                    </p>
                  </div>

                  {/* PRICING MATRIX TABLE */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">
                        Daily
                      </span>
                      <span className="font-black text-gray-950 text-sm">
                        ${machine.dailyRate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">
                        Weekly (Save)
                      </span>
                      <span className="font-black text-emerald-700 text-sm">
                        ${machine.weeklyRate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">
                        Monthly
                      </span>
                      <span className="font-black text-gray-950 text-sm">
                        ${machine.monthlyRate}
                      </span>
                    </div>
                  </div>

                  {/* ENGINE SPECS & HOUR METER */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-100 p-2 rounded border border-gray-200">
                      <span className="text-[10px] text-gray-500 font-bold block uppercase">
                        Engine Specs
                      </span>
                      <span className="font-bold text-gray-900 truncate block">
                        {machine.engineSpecs}
                      </span>
                    </div>
                    <div className="bg-gray-100 p-2 rounded border border-gray-200">
                      <span className="text-[10px] text-gray-500 font-bold block uppercase">
                        Operating Hours
                      </span>
                      <span className="font-mono font-black text-gray-950">
                        {machine.engineHours || 140} hrs
                      </span>
                    </div>
                  </div>

                  {/* QUICK STATUS CHANGER ROW */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] font-bold text-gray-500 uppercase">
                      Status:
                    </span>
                    <select
                      value={machine.status || "available"}
                      onChange={(e) =>
                        handleQuickStatusChange(
                          machine.id,
                          e.target.value as EquipmentItem["status"]
                        )
                      }
                      className={`text-xs font-bold px-2 py-1 rounded border cursor-pointer ${curStatus.bg} ${curStatus.text}`}
                    >
                      <option value="available">Available in Yard</option>
                      <option value="rented">Rented / On-Site</option>
                      <option value="maintenance">Service Due / Repair</option>
                      <option value="reserved">48-Hr Hold Reserved</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CARD FOOTER ACTIONS */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2">
                {/* QUICK RATE ADJUSTER (-$25 / +$25) */}
                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600">
                  <span>Adj:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickRateChange(machine.id, -25)}
                    className="px-1.5 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition-colors cursor-pointer"
                    title="Decrease daily rate by $25"
                  >
                    -$25
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickRateChange(machine.id, 25)}
                    className="px-1.5 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition-colors cursor-pointer"
                    title="Increase daily rate by $25"
                  >
                    +$25
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDelete(machine.id, machine.name)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title="Delete equipment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(machine)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs flex items-center gap-1 transition-colors shadow-xs cursor-pointer active:scale-95"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Machine & Rates</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredFleet.length === 0 && (
          <div className="col-span-full bg-white border border-gray-200 p-8 rounded-lg text-center text-xs text-gray-500">
            <Wrench className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="font-bold text-gray-950 text-sm">No machines match your search or filter.</p>
            <p className="mt-1">Try clearing your search query or reset category filter.</p>
          </div>
        )}
      </div>

      {/* EDIT / ADD EQUIPMENT & PRICING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
          <div className="bg-white border-2 border-yellow-500 rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* MODAL HEADER */}
            <div className="bg-red-600 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-yellow-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                    {editingItem ? "Edit Equipment & Pricing" : "Add New Fleet Machine"}
                  </h3>
                  <p className="text-xs text-red-100 font-medium">
                    Configure machine specifications, rental rates, and operating terms.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY (SCROLLABLE FORM, STRICT ZERO HORIZONTAL OVERFLOW) */}
            <form onSubmit={handleSaveEquipment} className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden space-y-4 text-xs">
              {/* MACHINE NAME & CATEGORY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Machine Name & Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded font-bold text-gray-950 focus:border-red-600 focus:outline-none"
                    placeholder="e.g. CAT 259D3 Compact Track Loader"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Equipment Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as EquipmentItem["category"],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded font-bold text-gray-950 focus:border-red-600 focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="Track Loader">Track Loader</option>
                    <option value="Skid Steer">Skid Steer</option>
                    <option value="Utility Tractor">Utility Tractor</option>
                    <option value="Heavy Trailer">Heavy Trailer</option>
                    <option value="Water Trailer">Water Trailer</option>
                  </select>
                </div>
              </div>

              {/* RENTAL PRICING MATRIX */}
              <div className="border border-yellow-300 bg-yellow-50/60 p-3.5 rounded-lg space-y-2">
                <span className="font-black text-gray-950 uppercase tracking-wider block">
                  Rental Rates & Pricing ($ USD)
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block font-bold text-gray-700 mb-0.5">
                      Daily Rate ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.dailyRate}
                      onChange={(e) =>
                        setFormData({ ...formData, dailyRate: Number(e.target.value) })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded font-black text-gray-950 focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-0.5">
                      Weekly Rate ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.weeklyRate}
                      onChange={(e) =>
                        setFormData({ ...formData, weeklyRate: Number(e.target.value) })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded font-black text-gray-950 focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-0.5">
                      Monthly Rate ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.monthlyRate}
                      onChange={(e) =>
                        setFormData({ ...formData, monthlyRate: Number(e.target.value) })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded font-black text-gray-950 focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-0.5">
                      Overtime ($/hr)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.overtimeRate}
                      onChange={(e) =>
                        setFormData({ ...formData, overtimeRate: Number(e.target.value) })
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded font-black text-gray-950 focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SERIAL NUMBER & ENGINE SPECS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Serial # / Unit ID
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, serialNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded font-mono font-bold text-gray-950 focus:border-red-600 focus:outline-none"
                    placeholder="AZR-2026-CAT1"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Engine Hour Meter
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.engineHours || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, engineHours: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded font-mono font-bold text-gray-950 focus:border-red-600 focus:outline-none"
                    placeholder="145.5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Current Yard Status
                  </label>
                  <select
                    value={formData.status || "available"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as EquipmentItem["status"],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded font-bold text-gray-950 focus:border-red-600 focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="available">Available in Yard</option>
                    <option value="rented">Rented / On-Site</option>
                    <option value="maintenance">Service Due / In Repair</option>
                    <option value="reserved">48-Hr Hold Reserved</option>
                  </select>
                </div>
              </div>

              {/* ENGINE SPECS & OPERATING WEIGHT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Engine Specs
                  </label>
                  <input
                    type="text"
                    value={formData.engineSpecs}
                    onChange={(e) =>
                      setFormData({ ...formData, engineSpecs: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded font-medium text-gray-950 focus:border-red-600 focus:outline-none"
                    placeholder="CAT C3.3B Turbo Diesel (74.3 hp)"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Operating Weight & ROC
                  </label>
                  <input
                    type="text"
                    value={formData.operatingWeight}
                    onChange={(e) =>
                      setFormData({ ...formData, operatingWeight: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded font-medium text-gray-950 focus:border-red-600 focus:outline-none"
                    placeholder="8,987 lb • 2,010 lb ROC"
                  />
                </div>
              </div>

              {/* MULTI-IMAGE GALLERY & DRAG-AND-DROP UPLOAD */}
              <div className="space-y-2.5 border border-gray-200 rounded-xl p-3 sm:p-4 bg-gray-50/60">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-gray-900 uppercase text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-red-600" />
                      Equipment Photos & Gallery
                    </label>
                    <span className="text-[11px] font-black bg-yellow-400 text-gray-950 px-2 py-0.5 rounded-full">
                      {formData.images?.length || 0} Attached
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Upload multiple angles (front, side, trailer, attachments)
                  </span>
                </div>

                {/* DROPZONE FOR MULTIPLE FILES */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleProcessFiles(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all select-none ${
                    isDragging
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-gray-300 hover:border-red-500 hover:bg-white bg-white"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleProcessFiles(e.target.files);
                      }
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2 py-1">
                    <UploadCloud className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-xs font-bold text-gray-900">
                      Drag & drop multiple photos here, or <span className="text-red-600 underline">browse computer</span>
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Supports selecting multiple PNG, JPG, or WEBP photos (up to 12MB each)
                  </div>
                </div>

                {/* MANUAL URL INPUT BAR */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={manualUrlInput}
                    onChange={(e) => setManualUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddManualUrl();
                      }
                    }}
                    placeholder="Or paste image URL (e.g. /images/cat-front.webp or https://...)"
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded font-mono text-[11px] text-gray-950 focus:border-red-600 focus:outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualUrl}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded transition-colors cursor-pointer flex-shrink-0"
                  >
                    + Add URL
                  </button>
                </div>

                {/* QUICK PRESET ANGLE BUTTONS */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    Load Yard Preset Angles:
                  </span>
                  {PRESET_MACHINES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          imageUrl: preset.cover,
                          images: [...preset.images],
                        }));
                        showToast(`Loaded ${preset.images.length} photos for ${preset.label}!`);
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded border border-gray-300 bg-white hover:bg-yellow-400 hover:text-gray-950 hover:border-yellow-500 text-gray-700 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* THUMBNAIL GALLERY GRID (STRICT FIXED BOXES, ZERO HORIZONTAL OVERFLOW) */}
                {formData.images && formData.images.length > 0 ? (
                  <div className="pt-2">
                    <div className="text-[11px] font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                      <span>Attached Photos ({formData.images.length}): Click "Set Cover" to choose the main listing thumbnail</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, images: [], imageUrl: "" }));
                          showToast("Cleared all gallery photos.");
                        }}
                        className="text-[10px] text-red-600 hover:underline font-bold cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-56 overflow-y-auto overflow-x-hidden p-2 bg-white border border-gray-200 rounded-lg">
                      {formData.images.map((img, idx) => {
                        const isCover = img === formData.imageUrl || (!formData.imageUrl && idx === 0);
                        return (
                          <div
                            key={`${img}-${idx}`}
                            className={`group relative rounded-lg border-2 overflow-hidden bg-gray-100 flex flex-col justify-between transition-all ${
                              isCover
                                ? "border-yellow-500 ring-2 ring-yellow-400/50 shadow-xs"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            {/* STRICT FIXED BOX */}
                            <div className="w-full h-20 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                              <img
                                src={img}
                                alt={`Angle ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {isCover && (
                                <span className="absolute top-1 left-1 bg-yellow-400 text-gray-950 font-black text-[9px] px-1 py-0.2 rounded shadow-xs">
                                  ★ COVER
                                </span>
                              )}
                              <span className="absolute bottom-1 right-1 bg-black/70 text-white font-mono text-[9px] px-1 rounded">
                                #{idx + 1}
                              </span>
                            </div>

                            {/* CARD BOTTOM ACTIONS */}
                            <div className="p-1 bg-white border-t border-gray-200 flex items-center justify-between gap-1 text-[10px]">
                              {isCover ? (
                                <span className="font-black text-emerald-700 text-[10px] px-1">
                                  Primary
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setPrimaryCoverImage(img)}
                                  className="font-bold text-blue-600 hover:underline px-1 cursor-pointer"
                                >
                                  Set Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="text-red-600 hover:text-red-800 p-0.5 rounded hover:bg-red-50 cursor-pointer"
                                title="Remove this photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 text-center bg-white border border-dashed border-gray-300 rounded text-gray-500 text-xs">
                    No photos attached yet. Drag & drop photos above, enter a URL, or choose a preset.
                  </div>
                )}
              </div>

              {/* TAGLINE & DESCRIPTION */}
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded font-medium text-gray-950 focus:border-red-600 focus:outline-none"
                  placeholder="Heavy-duty track loader ready for Valley jobsites."
                />
              </div>

              {/* AZ 811 CHECKBOX */}
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded">
                <input
                  type="checkbox"
                  id="az811-check"
                  checked={formData.requiresAZ811}
                  onChange={(e) =>
                    setFormData({ ...formData, requiresAZ811: e.target.checked })
                  }
                  className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-600 cursor-pointer"
                />
                <label
                  htmlFor="az811-check"
                  className="font-bold text-gray-900 cursor-pointer select-none"
                >
                  Requires Mandatory Arizona 811 Dig-Law Ticket (A.R.S. § 40-360.21)
                </label>
              </div>

              {/* MODAL ACTIONS */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4 text-white" />
                  <span>{editingItem ? "Save Changes" : "Create Machine"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
