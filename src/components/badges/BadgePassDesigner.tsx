import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  GripVertical,
  Plus,
  Trash2,
  Sliders,
  MoveUp,
  MoveDown,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Copy,
  Save,
  Download,
  RotateCcw,
  Layers,
  Layout,
  Sparkles,
  ShieldAlert,
  Barcode,
  QrCode,
  User,
  Image as ImageIcon,
  Building2,
  Clock,
  Calendar,
  Wifi,
  Phone,
  AlertTriangle,
  Printer,
  Eye,
  Palette,
  CheckCircle2,
  Shield,
  FileCheck,
  ChevronRight,
  ChevronDown,
  Search,
  Tag,
  KeyRound,
  FileText,
  DoorOpen,
  ArrowUpDown,
  Laptop
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Visit, BadgeTemplate, Tenant } from '../../types';
import { JSAlphaSoftLogo } from '../common/JSAlphaSoftLogo';
import { generateVisitorPassPdf } from '../../utils/passPdfGenerator';

export type PassComponentType =
  | 'header_banner'
  | 'category_badge'
  | 'lanyard_hole'
  | 'visitor_photo'
  | 'visitor_name'
  | 'visitor_company'
  | 'badge_number'
  | 'security_clearance'
  | 'escort_notice'
  | 'host_details'
  | 'site_gate'
  | 'validity_period'
  | 'expiry_countdown'
  | 'dynamic_qr'
  | 'barcode_1d'
  | 'wifi_credentials'
  | 'muster_point'
  | 'safety_instructions'
  | 'emergency_hotline'
  | 'watermark_seal'
  | 'custom_text'
  | 'divider_line';

export interface PassComponentItem {
  id: string;
  type: PassComponentType;
  title: string;
  category: 'IDENTITY' | 'SECURITY' | 'VISIT_METADATA' | 'BARCODES' | 'COMPLIANCE' | 'LAYOUT';
  enabled: boolean;
  required?: boolean;
  config?: {
    customLabel?: string;
    customText?: string;
    fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
    align?: 'left' | 'center' | 'right';
    color?: string;
    bgColor?: string;
    borderColor?: string;
    qrSize?: number;
    photoShape?: 'rounded' | 'circle' | 'square';
    clearanceLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'RESTRICTED';
    clearanceColor?: string;
    showIcon?: boolean;
    borderStyle?: 'solid' | 'dashed' | 'none';
  };
}

export interface AvailableComponentDef {
  type: PassComponentType;
  title: string;
  category: 'IDENTITY' | 'SECURITY' | 'VISIT_METADATA' | 'BARCODES' | 'COMPLIANCE' | 'LAYOUT';
  description: string;
  icon: any;
  defaultConfig?: PassComponentItem['config'];
}

export const AVAILABLE_PASS_COMPONENTS: AvailableComponentDef[] = [
  // Layout & Branding
  {
    type: 'header_banner',
    title: 'Organization & Logo Header',
    category: 'LAYOUT',
    description: 'Header stripe with tenant logo, brand emblem, and facility title.',
    icon: Building2,
    defaultConfig: { bgColor: '#123B5D', color: '#FFFFFF', align: 'left' }
  },
  {
    type: 'lanyard_hole',
    title: 'Lanyard Slot Cutout',
    category: 'LAYOUT',
    description: 'Physical badge clip / oval lanyard hole punch cutout visualization.',
    icon: Layout,
    defaultConfig: { align: 'center' }
  },
  {
    type: 'divider_line',
    title: 'Accent Divider Line',
    category: 'LAYOUT',
    description: 'Crisp visual separator line with customizable color and style.',
    icon: ArrowUpDown,
    defaultConfig: { borderColor: '#CBD5E1', borderStyle: 'solid' }
  },
  {
    type: 'custom_text',
    title: 'Custom Note / Annotations',
    category: 'LAYOUT',
    description: 'Freeform text block for custom announcements, floor rules, or vehicle tags.',
    icon: FileText,
    defaultConfig: { customText: 'Special Access Granted for R&D Floor 3.', fontSize: 'xs', align: 'left' }
  },

  // Identity
  {
    type: 'visitor_photo',
    title: 'Visitor Photo / Avatar',
    category: 'IDENTITY',
    description: 'High-resolution visitor portrait with selectable frame shape and border.',
    icon: ImageIcon,
    defaultConfig: { photoShape: 'rounded', borderColor: '#CBD5E1' }
  },
  {
    type: 'visitor_name',
    title: 'Visitor Full Name',
    category: 'IDENTITY',
    description: 'Primary typography display of visitor full legal name.',
    icon: User,
    defaultConfig: { fontSize: 'lg', align: 'left', color: '#0F172A' }
  },
  {
    type: 'visitor_company',
    title: 'Visitor Company / Org',
    category: 'IDENTITY',
    description: 'Visitor employer or affiliated organization name.',
    icon: Building2,
    defaultConfig: { fontSize: 'sm', align: 'left', color: '#0F766E' }
  },
  {
    type: 'category_badge',
    title: 'Visitor Category Pill',
    category: 'IDENTITY',
    description: 'Badge tag indicating category (Visitor, Contractor, VIP, Vendor, Delivery).',
    icon: Tag,
    defaultConfig: { bgColor: '#E0F2FE', color: '#0369A1', align: 'left' }
  },

  // Access & Security
  {
    type: 'badge_number',
    title: 'Badge ID / Pass Serial',
    category: 'SECURITY',
    description: 'Unique alphanumeric identifier with security serial checksum.',
    icon: KeyRound,
    defaultConfig: { fontSize: 'sm', align: 'left', color: '#475569' }
  },
  {
    type: 'security_clearance',
    title: 'Security Clearance Band',
    category: 'SECURITY',
    description: 'Visual clearance color band (Level 1 Low, Escorted, High, Vault).',
    icon: Shield,
    defaultConfig: { clearanceLevel: 'HIGH', clearanceColor: '#059669', align: 'center' }
  },
  {
    type: 'escort_notice',
    title: 'Escort Requirement Notice',
    category: 'SECURITY',
    description: 'Prominent indicator whether visitor requires full security escort.',
    icon: ShieldAlert,
    defaultConfig: { customText: 'MANDATORY SECURITY ESCORT REQUIRED AT ALL TIMES', color: '#DC2626', align: 'center' }
  },
  {
    type: 'watermark_seal',
    title: 'Security Hologram Seal',
    category: 'SECURITY',
    description: 'Tamper-evident authenticity watermark and digital security seal.',
    icon: Sparkles,
    defaultConfig: { customText: 'OFFICIAL PASS • SECURE AUTHENTICATION', color: '#94A3B8', align: 'center' }
  },

  // Visit Metadata
  {
    type: 'host_details',
    title: 'Host & Department',
    category: 'VISIT_METADATA',
    description: 'Authorized host employee name, job title, and internal department.',
    icon: User,
    defaultConfig: { fontSize: 'xs', align: 'left', color: '#334155' }
  },
  {
    type: 'site_gate',
    title: 'Site & Entry Gate',
    category: 'VISIT_METADATA',
    description: 'Designated physical facility, campus building, and cleared gate entry.',
    icon: DoorOpen,
    defaultConfig: { fontSize: 'xs', align: 'left', color: '#334155' }
  },
  {
    type: 'validity_period',
    title: 'Valid Date & Time',
    category: 'VISIT_METADATA',
    description: 'Scheduled visit start timestamp and active validity window.',
    icon: Calendar,
    defaultConfig: { fontSize: 'xs', align: 'left', color: '#334155' }
  },
  {
    type: 'expiry_countdown',
    title: 'Expiration & Void Time',
    category: 'VISIT_METADATA',
    description: 'Pass expiration timestamp and same-day void validity rule.',
    icon: Clock,
    defaultConfig: { fontSize: 'xs', align: 'left', color: '#B45309' }
  },
  {
    type: 'wifi_credentials',
    title: 'Guest Wi-Fi Access',
    category: 'VISIT_METADATA',
    description: 'Automated guest network SSID and temporary Wi-Fi access voucher code.',
    icon: Wifi,
    defaultConfig: { customText: 'SSID: TataGuest_Secure • Voucher: #8921-TATA', fontSize: 'xs', align: 'left' }
  },

  // Barcodes & QR
  {
    type: 'dynamic_qr',
    title: 'Dynamic Express QR Code',
    category: 'BARCODES',
    description: 'Cryptographic QR code for instant smartphone touchless checkout or turnstile gate.',
    icon: QrCode,
    defaultConfig: { qrSize: 110, align: 'center' }
  },
  {
    type: 'barcode_1d',
    title: 'Code-128 Optical Barcode',
    category: 'BARCODES',
    description: 'Standard 1D barcode compatible with legacy handheld barcode scanners.',
    icon: Barcode,
    defaultConfig: { align: 'center', fontSize: 'xs' }
  },

  // Compliance & Safety
  {
    type: 'muster_point',
    title: 'Emergency Muster Point',
    category: 'COMPLIANCE',
    description: 'Designated emergency evacuation assembly location and route.',
    icon: AlertTriangle,
    defaultConfig: { customText: 'Evacuation Assembly: Point #4 (North Lawn)', fontSize: 'xs', align: 'left', color: '#D97706' }
  },
  {
    type: 'safety_instructions',
    title: 'Safety & NDA Instructions',
    category: 'COMPLIANCE',
    description: 'Terms of entry, non-disclosure compliance, and pass wear policies.',
    icon: FileCheck,
    defaultConfig: { customText: 'Must be visibly worn at all times above the waist. Return pass upon checkout.', fontSize: 'xs', align: 'left' }
  },
  {
    type: 'emergency_hotline',
    title: 'Security Dispatch Hotline',
    category: 'COMPLIANCE',
    description: 'Direct phone extension for facility security operations center (SOC).',
    icon: Phone,
    defaultConfig: { customText: 'Security Hotline: Ext 4040 / +91-80-6712-8000', fontSize: 'xs', align: 'left' }
  }
];

export interface PassDesignerState {
  templateName: string;
  orientation: 'PORTRAIT' | 'LANDSCAPE';
  passType: 'CR80_CARD' | 'ADHESIVE_LABEL' | 'CONFERENCE_PASS' | 'MOBILE_WALLET_PASS';
  widthMm: number;
  heightMm: number;
  headerBackground: string;
  headerTextColor: string;
  cardBackground: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  borderAccentColor: string;
  watermarkText: string;
  watermarkOpacity: number;
  components: PassComponentItem[];
}

const DEFAULT_PORTRAIT_COMPONENTS: PassComponentItem[] = [
  {
    id: 'comp-1',
    type: 'header_banner',
    title: 'Organization & Logo Header',
    category: 'LAYOUT',
    enabled: true,
    required: true,
    config: { bgColor: '#123B5D', color: '#FFFFFF', align: 'left' }
  },
  {
    id: 'comp-2',
    type: 'visitor_photo',
    title: 'Visitor Photo / Avatar',
    category: 'IDENTITY',
    enabled: true,
    config: { photoShape: 'rounded', borderColor: '#CBD5E1' }
  },
  {
    id: 'comp-3',
    type: 'visitor_name',
    title: 'Visitor Full Name',
    category: 'IDENTITY',
    enabled: true,
    required: true,
    config: { fontSize: 'lg', align: 'center', color: '#0F172A' }
  },
  {
    id: 'comp-4',
    type: 'visitor_company',
    title: 'Visitor Company / Org',
    category: 'IDENTITY',
    enabled: true,
    config: { fontSize: 'sm', align: 'center', color: '#0F766E' }
  },
  {
    id: 'comp-5',
    type: 'category_badge',
    title: 'Visitor Category Pill',
    category: 'IDENTITY',
    enabled: true,
    config: { bgColor: '#E0F2FE', color: '#0369A1', align: 'center' }
  },
  {
    id: 'comp-6',
    type: 'security_clearance',
    title: 'Security Clearance Band',
    category: 'SECURITY',
    enabled: true,
    config: { clearanceLevel: 'HIGH', clearanceColor: '#059669', align: 'center' }
  },
  {
    id: 'comp-7',
    type: 'host_details',
    title: 'Host & Department',
    category: 'VISIT_METADATA',
    enabled: true,
    config: { fontSize: 'xs', align: 'left', color: '#334155' }
  },
  {
    id: 'comp-8',
    type: 'site_gate',
    title: 'Site & Entry Gate',
    category: 'VISIT_METADATA',
    enabled: true,
    config: { fontSize: 'xs', align: 'left', color: '#334155' }
  },
  {
    id: 'comp-9',
    type: 'dynamic_qr',
    title: 'Dynamic Express QR Code',
    category: 'BARCODES',
    enabled: true,
    config: { qrSize: 110, align: 'center' }
  },
  {
    id: 'comp-10',
    type: 'safety_instructions',
    title: 'Safety & NDA Instructions',
    category: 'COMPLIANCE',
    enabled: true,
    config: { customText: 'Must be visibly worn above waist. Return to reception turnstile on checkout.', fontSize: 'xs', align: 'center' }
  }
];

interface BadgePassDesignerProps {
  initialVisit?: Visit | null;
  onTemplateSaved?: (template: BadgeTemplate) => void;
  onNavigateToSpooler?: () => void;
}

export const BadgePassDesigner: React.FC<BadgePassDesignerProps> = ({
  initialVisit,
  onTemplateSaved,
  onNavigateToSpooler
}) => {
  const state = storageService.getState();
  const activeTenant: Tenant = storageService.getActiveTenant();
  const activeSite = storageService.getActiveSite();

  // Selected visit for live preview
  const [previewVisitId, setPreviewVisitId] = useState<string>(
    initialVisit?.id || state.visits[0]?.id || ''
  );
  const previewVisit = state.visits.find((v) => v.id === previewVisitId) || state.visits[0] || {
    id: 'vis-demo-101',
    tenantId: activeTenant.id,
    siteId: activeSite.id,
    visitorName: 'Rajesh V. Sharma',
    visitorCompany: 'Tata Consultancy Services',
    visitorCategory: 'OFFICIAL_VISITOR',
    hostName: 'Vikram Sethi',
    departmentName: 'Cyber Security Operations',
    scheduledStart: new Date().toISOString(),
    assignedZone: 'Zone B - Research Labs',
    badgeNumber: 'TATA-BLR-0081',
    state: 'CHECKED_IN'
  };

  // Designer Canvas State
  const [designerState, setDesignerState] = useState<PassDesignerState>(() => {
    const existing = state.badgeTemplates[0];
    return {
      templateName: existing ? existing.name : 'Custom Enterprise Visitor Pass',
      orientation: existing?.badgeLayoutOrientation || 'PORTRAIT',
      passType: existing?.type || 'CR80_CARD',
      widthMm: existing?.widthMm || 85.6,
      heightMm: existing?.heightMm || 120,
      headerBackground: existing?.headerBackground || '#123B5D',
      headerTextColor: '#FFFFFF',
      cardBackground: '#FFFFFF',
      borderRadius: 'lg',
      borderAccentColor: '#CBD5E1',
      watermarkText: 'OFFICIAL VISITOR PASS',
      watermarkOpacity: 0.08,
      components: DEFAULT_PORTRAIT_COMPONENTS
    };
  });

  // Selected component in inspector
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>('comp-1');
  const [activeInspectorTab, setActiveInspectorTab] = useState<'component' | 'pass' | 'presets'>('component');

  // Drag-and-drop state
  const [draggedPaletteType, setDraggedPaletteType] = useState<PassComponentType | null>(null);
  const [draggedCanvasIndex, setDraggedCanvasIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [isDragOverCanvas, setIsDragOverCanvas] = useState<boolean>(false);

  // Component search / category filter
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Zoom level for canvas
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // QR code preview URL
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Generate dynamic QR code for preview
  useEffect(() => {
    if (!previewVisit) return;
    const baseUrl = window.location.origin;
    const qrPayload = `${baseUrl}/?action=express-checkout&visitId=${previewVisit.id}&badge=${previewVisit.badgeNumber || 'PENDING'}&t=${Date.now()}`;

    QRCode.toDataURL(qrPayload, {
      width: 160,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#0F766E',
        light: '#FFFFFF'
      }
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('Failed to generate preview QR', err));
  }, [previewVisit]);

  // Filtered available components in palette
  const filteredPaletteComponents = AVAILABLE_PASS_COMPONENTS.filter((comp) => {
    const matchesCategory = categoryFilter === 'ALL' || comp.category === categoryFilter;
    const matchesSearch =
      comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Check if a component is already added on the canvas
  const isComponentOnCanvas = (type: PassComponentType) => {
    return designerState.components.some((c) => c.type === type);
  };

  // Add component to canvas
  const handleAddComponent = (type: PassComponentType, targetIndex?: number) => {
    const def = AVAILABLE_PASS_COMPONENTS.find((c) => c.type === type);
    if (!def) return;

    const newComponent: PassComponentItem = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: def.type,
      title: def.title,
      category: def.category,
      enabled: true,
      config: { ...def.defaultConfig }
    };

    setDesignerState((prev) => {
      const updated = [...prev.components];
      if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= updated.length) {
        updated.splice(targetIndex, 0, newComponent);
      } else {
        updated.push(newComponent);
      }
      return { ...prev, components: updated };
    });

    setSelectedComponentId(newComponent.id);
    setActiveInspectorTab('component');
    setFeedback({ type: 'success', message: `Added "${def.title}" to pass canvas.` });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Remove component from canvas
  const handleRemoveComponent = (id: string) => {
    setDesignerState((prev) => ({
      ...prev,
      components: prev.components.filter((c) => c.id !== id)
    }));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  };

  // Move component up or down
  const handleMoveComponent = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= designerState.components.length) return;

    setDesignerState((prev) => {
      const list = [...prev.components];
      const item = list[index];
      list.splice(index, 1);
      list.splice(targetIndex, 0, item);
      return { ...prev, components: list };
    });
  };

  // Drag start from Palette
  const handlePaletteDragStart = (e: React.DragEvent, type: PassComponentType) => {
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
    setDraggedPaletteType(type);
    setDraggedCanvasIndex(null);
  };

  // Drag start from Canvas (reordering)
  const handleCanvasDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', `reorder-${index}`);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedCanvasIndex(index);
    setDraggedPaletteType(null);
  };

  // Drag over Canvas item
  const handleCanvasItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTargetIndex(index);
  };

  // Drop on Canvas
  const handleCanvasDrop = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCanvas(false);

    const effectiveTargetIndex =
      typeof targetIndex === 'number'
        ? targetIndex
        : dropTargetIndex !== null
        ? dropTargetIndex
        : designerState.components.length;

    // Case 1: Reordering an existing canvas component
    if (draggedCanvasIndex !== null) {
      if (draggedCanvasIndex === effectiveTargetIndex) {
        setDraggedCanvasIndex(null);
        setDropTargetIndex(null);
        return;
      }
      setDesignerState((prev) => {
        const list = [...prev.components];
        const [movedItem] = list.splice(draggedCanvasIndex, 1);
        list.splice(effectiveTargetIndex, 0, movedItem);
        return { ...prev, components: list };
      });
      setDraggedCanvasIndex(null);
      setDropTargetIndex(null);
      return;
    }

    // Case 2: Dropping a new component from Palette
    const componentType = draggedPaletteType || (e.dataTransfer.getData('text/plain') as PassComponentType);
    if (componentType) {
      handleAddComponent(componentType, effectiveTargetIndex);
    }

    setDraggedPaletteType(null);
    setDropTargetIndex(null);
  };

  const selectedComponent = designerState.components.find((c) => c.id === selectedComponentId);

  // Update selected component config
  const updateSelectedComponentConfig = (newConfig: Partial<PassComponentItem['config']>) => {
    if (!selectedComponentId) return;
    setDesignerState((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.id === selectedComponentId
          ? { ...c, config: { ...c.config, ...newConfig } }
          : c
      )
    }));
  };

  // Update selected component title
  const updateSelectedComponentTitle = (newTitle: string) => {
    if (!selectedComponentId) return;
    setDesignerState((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.id === selectedComponentId ? { ...c, title: newTitle } : c
      )
    }));
  };

  // Save Template to storageService
  const handleSaveTemplate = () => {
    const templatePayload: BadgeTemplate = {
      id: `tmpl-${Date.now()}`,
      tenantId: activeTenant.id,
      name: designerState.templateName,
      type: designerState.passType,
      widthMm: designerState.widthMm,
      heightMm: designerState.heightMm,
      showPhoto: isComponentOnCanvas('visitor_photo'),
      showQrCode: isComponentOnCanvas('dynamic_qr'),
      showBarcode: isComponentOnCanvas('barcode_1d'),
      showHost: isComponentOnCanvas('host_details'),
      showCategoryColor: isComponentOnCanvas('category_badge'),
      showHeaderLogo: isComponentOnCanvas('header_banner'),
      showMusterPoint: isComponentOnCanvas('muster_point'),
      showExpiryTime: isComponentOnCanvas('expiry_countdown'),
      headerBackground: designerState.headerBackground,
      headerTextColor: designerState.headerTextColor,
      accentBorderColor: designerState.borderAccentColor,
      instructions:
        designerState.components.find((c) => c.type === 'safety_instructions')?.config?.customText ||
        'Must be visibly worn at all times above the waist.',
      badgeLayoutOrientation: designerState.orientation,
      watermarkText: designerState.watermarkText,
      thermalSettings: {
        printerBrand: 'ZEBRA',
        darknessLevel: 15,
        printSpeedIps: 4,
        cutterMode: 'TEAR_OFF',
        resolutionDpi: 300
      }
    };

    const res = storageService.saveBadgeTemplate(templatePayload);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: `Pass template "${templatePayload.name}" saved to enterprise registry.`
      });
      if (onTemplateSaved) onTemplateSaved(res.template);
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({ type: 'error', message: 'Failed to save pass template.' });
    }
  };

  // Preset Loaders
  const loadPreset = (presetName: string) => {
    if (presetName === 'STANDARD_CORPORATE') {
      setDesignerState({
        templateName: 'Standard Tata Enterprise Visitor Pass (CR80)',
        orientation: 'PORTRAIT',
        passType: 'CR80_CARD',
        widthMm: 85.6,
        heightMm: 120,
        headerBackground: '#123B5D',
        headerTextColor: '#FFFFFF',
        cardBackground: '#FFFFFF',
        borderRadius: 'lg',
        borderAccentColor: '#CBD5E1',
        watermarkText: 'OFFICIAL VISITOR PASS',
        watermarkOpacity: 0.08,
        components: DEFAULT_PORTRAIT_COMPONENTS
      });
    } else if (presetName === 'CONTRACTOR_SAFETY') {
      setDesignerState({
        templateName: 'Contractor High-Vis Safety Pass (Adhesive)',
        orientation: 'LANDSCAPE',
        passType: 'ADHESIVE_LABEL',
        widthMm: 101.6,
        heightMm: 76.2,
        headerBackground: '#B45309',
        headerTextColor: '#FFFFFF',
        cardBackground: '#FEF3C7',
        borderRadius: 'md',
        borderAccentColor: '#F59E0B',
        watermarkText: 'SAFETY ESCORT MANDATORY',
        watermarkOpacity: 0.12,
        components: [
          {
            id: 'p-1',
            type: 'header_banner',
            title: 'Organization Header',
            category: 'LAYOUT',
            enabled: true,
            config: { bgColor: '#B45309', color: '#FFFFFF', align: 'left' }
          },
          {
            id: 'p-2',
            type: 'escort_notice',
            title: 'Escort Notice',
            category: 'SECURITY',
            enabled: true,
            config: { customText: 'SAFETY HELMET & ESCORT MANDATORY IN INDUSTRIAL ZONES', color: '#B45309', align: 'center' }
          },
          {
            id: 'p-3',
            type: 'visitor_name',
            title: 'Visitor Name',
            category: 'IDENTITY',
            enabled: true,
            config: { fontSize: 'lg', align: 'left', color: '#78350F' }
          },
          {
            id: 'p-4',
            type: 'visitor_company',
            title: 'Contractor Company',
            category: 'IDENTITY',
            enabled: true,
            config: { fontSize: 'sm', align: 'left', color: '#92400E' }
          },
          {
            id: 'p-5',
            type: 'security_clearance',
            title: 'Clearance Band',
            category: 'SECURITY',
            enabled: true,
            config: { clearanceLevel: 'MEDIUM', clearanceColor: '#D97706', align: 'center' }
          },
          {
            id: 'p-6',
            type: 'dynamic_qr',
            title: 'Express QR',
            category: 'BARCODES',
            enabled: true,
            config: { qrSize: 90, align: 'center' }
          },
          {
            id: 'p-7',
            type: 'muster_point',
            title: 'Muster Point',
            category: 'COMPLIANCE',
            enabled: true,
            config: { customText: 'Muster Area: South Fire Gate Point #2', fontSize: 'xs', align: 'left' }
          }
        ]
      });
    } else if (presetName === 'EXECUTIVE_VIP') {
      setDesignerState({
        templateName: 'Executive VIP All-Access Pass',
        orientation: 'PORTRAIT',
        passType: 'CR80_CARD',
        widthMm: 85.6,
        heightMm: 120,
        headerBackground: '#0F172A',
        headerTextColor: '#F8FAFC',
        cardBackground: '#F8FAFC',
        borderRadius: 'xl',
        borderAccentColor: '#64748B',
        watermarkText: 'VIP EXECUTIVE CLEARANCE',
        watermarkOpacity: 0.1,
        components: [
          {
            id: 'v-1',
            type: 'header_banner',
            title: 'Organization Header',
            category: 'LAYOUT',
            enabled: true,
            config: { bgColor: '#0F172A', color: '#F8FAFC', align: 'left' }
          },
          {
            id: 'v-2',
            type: 'security_clearance',
            title: 'Clearance Level',
            category: 'SECURITY',
            enabled: true,
            config: { clearanceLevel: 'RESTRICTED', clearanceColor: '#7C3AED', align: 'center' }
          },
          {
            id: 'v-3',
            type: 'visitor_photo',
            title: 'VIP Photo',
            category: 'IDENTITY',
            enabled: true,
            config: { photoShape: 'circle', borderColor: '#7C3AED' }
          },
          {
            id: 'v-4',
            type: 'visitor_name',
            title: 'VIP Name',
            category: 'IDENTITY',
            enabled: true,
            config: { fontSize: 'xl', align: 'center', color: '#0F172A' }
          },
          {
            id: 'v-5',
            type: 'badge_number',
            title: 'VIP Badge Serial',
            category: 'SECURITY',
            enabled: true,
            config: { fontSize: 'sm', align: 'center', color: '#6D28D9' }
          },
          {
            id: 'v-6',
            type: 'dynamic_qr',
            title: 'Direct Pass Token QR',
            category: 'BARCODES',
            enabled: true,
            config: { qrSize: 110, align: 'center' }
          },
          {
            id: 'v-7',
            type: 'wifi_credentials',
            title: 'VIP Executive Wi-Fi',
            category: 'VISIT_METADATA',
            enabled: true,
            config: { customText: 'Executive Wi-Fi: Tata_Executive_5G • Key: VIP-UNLIMITED', fontSize: 'xs', align: 'center' }
          }
        ]
      });
    }

    setFeedback({ type: 'success', message: `Preset "${presetName}" loaded onto canvas.` });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Render Component on Pass Canvas
  const renderCanvasComponent = (item: PassComponentItem, index: number) => {
    const isSelected = selectedComponentId === item.id;
    const cfg = item.config || {};

    let content: React.ReactNode = null;

    switch (item.type) {
      case 'header_banner':
        content = (
          <div
            className="p-3 text-white flex items-center justify-between transition"
            style={{ backgroundColor: cfg.bgColor || designerState.headerBackground }}
          >
            <div className="flex items-center gap-2">
              <JSAlphaSoftLogo variant="icon" size="sm" />
              <div className="leading-tight">
                <span className="font-extrabold text-xs tracking-wider uppercase block">
                  {activeTenant.name}
                </span>
                <span className="text-[8px] text-slate-300 tracking-wider uppercase">
                  Visitor Access System
                </span>
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded tracking-wide">
              {previewVisit.visitorCategory.replace(/_/g, ' ')}
            </span>
          </div>
        );
        break;

      case 'lanyard_hole':
        content = (
          <div className="py-2 flex justify-center items-center">
            <div className="w-12 h-3.5 rounded-full border-2 border-dashed border-slate-400 bg-slate-100 flex items-center justify-center">
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-mono">
                CLIP HOLE
              </span>
            </div>
          </div>
        );
        break;

      case 'visitor_photo':
        const shapeClass =
          cfg.photoShape === 'circle'
            ? 'rounded-full'
            : cfg.photoShape === 'square'
            ? 'rounded-none'
            : 'rounded-xl';
        content = (
          <div className="flex justify-center py-1">
            <div
              className={`w-20 h-20 bg-slate-100 border-2 overflow-hidden flex items-center justify-center shadow-inner ${shapeClass}`}
              style={{ borderColor: cfg.borderColor || '#CBD5E1' }}
            >
              <div className="flex flex-col items-center justify-center text-slate-700">
                <span className="text-3xl font-extrabold">
                  {previewVisit.visitorName.charAt(0)}
                </span>
                <span className="text-[9px] font-mono uppercase text-slate-400">PHOTO ID</span>
              </div>
            </div>
          </div>
        );
        break;

      case 'visitor_name':
        content = (
          <div
            className={`py-0.5 ${
              cfg.align === 'center'
                ? 'text-center'
                : cfg.align === 'right'
                ? 'text-right'
                : 'text-left'
            }`}
          >
            <h3
              className={`font-black tracking-tight leading-snug ${
                cfg.fontSize === 'xl'
                  ? 'text-xl'
                  : cfg.fontSize === 'lg'
                  ? 'text-lg'
                  : cfg.fontSize === 'sm'
                  ? 'text-sm'
                  : 'text-base'
              }`}
              style={{ color: cfg.color || '#0F172A' }}
            >
              {previewVisit.visitorName}
            </h3>
          </div>
        );
        break;

      case 'visitor_company':
        content = (
          <div
            className={`py-0.5 ${
              cfg.align === 'center'
                ? 'text-center'
                : cfg.align === 'right'
                ? 'text-right'
                : 'text-left'
            }`}
          >
            <p
              className={`font-semibold ${
                cfg.fontSize === 'xs' ? 'text-[11px]' : 'text-xs'
              }`}
              style={{ color: cfg.color || '#0F766E' }}
            >
              {previewVisit.visitorCompany || 'Independent Guest'}
            </p>
          </div>
        );
        break;

      case 'category_badge':
        content = (
          <div
            className={`py-1 flex ${
              cfg.align === 'center'
                ? 'justify-center'
                : cfg.align === 'right'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <span
              className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-2xs"
              style={{
                backgroundColor: cfg.bgColor || '#E0F2FE',
                color: cfg.color || '#0369A1'
              }}
            >
              {previewVisit.visitorCategory.replace(/_/g, ' ')}
            </span>
          </div>
        );
        break;

      case 'badge_number':
        content = (
          <div
            className={`py-0.5 ${
              cfg.align === 'center'
                ? 'text-center'
                : cfg.align === 'right'
                ? 'text-right'
                : 'text-left'
            }`}
          >
            <span className="font-mono text-xs font-bold tracking-widest text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
              #{previewVisit.badgeNumber || 'TATA-BLR-0081'}
            </span>
          </div>
        );
        break;

      case 'security_clearance':
        const clearanceColor = cfg.clearanceColor || '#059669';
        content = (
          <div
            className="py-1 px-3 rounded text-[10px] font-bold uppercase text-white flex items-center justify-between shadow-2xs"
            style={{ backgroundColor: clearanceColor }}
          >
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>CLEARANCE: {cfg.clearanceLevel || 'HIGH'}</span>
            </span>
            <span className="text-[9px] font-mono tracking-wider opacity-90">
              {previewVisit.assignedZone || 'ZONE A'}
            </span>
          </div>
        );
        break;

      case 'escort_notice':
        content = (
          <div
            className="py-1 px-2 rounded border border-red-300 bg-red-50 text-red-700 text-[10px] font-bold text-center leading-tight flex items-center justify-center gap-1"
          >
            <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
            <span>{cfg.customText || 'ESCORT MANDATORY AT ALL TIMES'}</span>
          </div>
        );
        break;

      case 'host_details':
        content = (
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] leading-tight space-y-0.5">
            <div className="text-slate-500 text-[10px] uppercase font-semibold">Authorized Host</div>
            <div className="font-bold text-slate-800">
              {previewVisit.hostName} • <span className="font-normal text-slate-600">{previewVisit.departmentName}</span>
            </div>
          </div>
        );
        break;

      case 'site_gate':
        content = (
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] leading-tight space-y-0.5">
            <div className="text-slate-500 text-[10px] uppercase font-semibold">Campus & Entry Point</div>
            <div className="font-semibold text-slate-800">
              {activeSite.name} • Gate Entry Cleared
            </div>
          </div>
        );
        break;

      case 'validity_period':
        content = (
          <div className="flex items-center justify-between text-[10px] text-slate-600 py-0.5 px-1 border-t border-slate-100">
            <span><strong>Valid:</strong> {new Date(previewVisit.scheduledStart).toLocaleDateString()}</span>
            <span><strong>Check-in:</strong> 09:30 IST</span>
          </div>
        );
        break;

      case 'expiry_countdown':
        content = (
          <div className="py-1 px-2 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-medium flex items-center justify-between">
            <span className="flex items-center gap-1 font-semibold">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Expires Today: 20:00 IST</span>
            </span>
            <span className="text-[9px] uppercase font-mono text-amber-700">Same-Day Void</span>
          </div>
        );
        break;

      case 'wifi_credentials':
        content = (
          <div className="p-2 rounded bg-teal-50/70 border border-teal-200 text-teal-900 text-[10px] space-y-0.5">
            <div className="font-bold flex items-center gap-1 text-[11px]">
              <Wifi className="w-3 h-3 text-teal-700" />
              <span>Guest Wi-Fi Voucher</span>
            </div>
            <div className="font-mono text-[9px] text-teal-800">
              {cfg.customText || 'SSID: TataGuest_Secure • Voucher: #8921-TATA'}
            </div>
          </div>
        );
        break;

      case 'dynamic_qr':
        content = (
          <div className="py-2 flex flex-col items-center justify-center">
            <div
              className="bg-white p-1.5 rounded-lg border border-teal-400 shadow-xs flex items-center justify-center"
              style={{ width: `${cfg.qrSize || 100}px`, height: `${cfg.qrSize || 100}px` }}
            >
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Dynamic QR" className="w-full h-full object-contain" />
              ) : (
                <QrCode className="w-12 h-12 text-teal-600" />
              )}
            </div>
            <div className="mt-1 text-center">
              <span className="text-[9px] uppercase tracking-wider font-bold text-teal-900 block">
                Express Touchless Check-Out QR
              </span>
              <span className="text-[8px] text-slate-500 font-mono">
                Scan with smartphone to exit turnstile
              </span>
            </div>
          </div>
        );
        break;

      case 'barcode_1d':
        content = (
          <div className="py-2 flex flex-col items-center justify-center">
            <div className="h-10 w-44 bg-slate-900 flex items-center justify-around px-2 rounded-xs">
              <div className="h-full w-1 bg-white"></div>
              <div className="h-full w-2 bg-slate-900"></div>
              <div className="h-full w-1.5 bg-white"></div>
              <div className="h-full w-0.5 bg-white"></div>
              <div className="h-full w-2 bg-white"></div>
              <div className="h-full w-1 bg-white"></div>
              <div className="h-full w-2 bg-slate-900"></div>
              <div className="h-full w-1.5 bg-white"></div>
              <div className="h-full w-1 bg-white"></div>
              <div className="h-full w-2.5 bg-white"></div>
            </div>
            <span className="text-[8px] font-mono text-slate-600 tracking-widest mt-0.5">
              *{previewVisit.badgeNumber || 'TATA-BLR-0081'}*
            </span>
          </div>
        );
        break;

      case 'muster_point':
        content = (
          <div className="p-1.5 rounded bg-amber-50/70 border border-amber-200 text-amber-900 text-[10px] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-semibold leading-tight">
              {cfg.customText || 'Assembly Point #4: North Lawn Zone'}
            </span>
          </div>
        );
        break;

      case 'safety_instructions':
        content = (
          <div className="text-[9px] text-slate-500 leading-tight text-center py-1 px-2 border-t border-slate-200">
            {cfg.customText || 'Must be visibly worn at all times above the waist. Return pass upon departure.'}
          </div>
        );
        break;

      case 'emergency_hotline':
        content = (
          <div className="p-1.5 rounded bg-slate-100 text-slate-700 text-[10px] flex items-center justify-between font-mono">
            <span>Security Dispatch:</span>
            <span className="font-bold text-red-600">{cfg.customText || 'Ext 4040 / 112'}</span>
          </div>
        );
        break;

      case 'watermark_seal':
        content = (
          <div className="py-1 text-center">
            <div className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              <span>{cfg.customText || 'OFFICIAL PASS • SECURE'}</span>
            </div>
          </div>
        );
        break;

      case 'custom_text':
        content = (
          <div
            className={`p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 ${
              cfg.fontSize === 'xs' ? 'text-[10px]' : 'text-xs'
            } ${
              cfg.align === 'center'
                ? 'text-center'
                : cfg.align === 'right'
                ? 'text-right'
                : 'text-left'
            }`}
          >
            {cfg.customText || 'Special Access Granted for R&D Lab.'}
          </div>
        );
        break;

      case 'divider_line':
        content = (
          <div
            className="my-1.5 border-t"
            style={{
              borderColor: cfg.borderColor || '#CBD5E1',
              borderStyle: cfg.borderStyle || 'solid'
            }}
          />
        );
        break;

      default:
        content = <div className="text-xs text-slate-500 py-1">{item.title}</div>;
    }

    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => handleCanvasDragStart(e, index)}
        onDragOver={(e) => handleCanvasItemDragOver(e, index)}
        onClick={() => {
          setSelectedComponentId(item.id);
          setActiveInspectorTab('component');
        }}
        className={`relative group cursor-pointer transition-all rounded-lg select-none ${
          isSelected
            ? 'ring-2 ring-teal-500 shadow-md bg-teal-50/20'
            : 'hover:ring-1 hover:ring-teal-300'
        }`}
      >
        {/* Floating Quick Action Overlay on Hover */}
        <div className="absolute right-1 top-1 hidden group-hover:flex items-center gap-1 z-30 bg-white/95 border border-slate-200 shadow-sm rounded-md px-1 py-0.5 text-slate-700">
          <button
            title="Move Up"
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation();
              handleMoveComponent(index, 'UP');
            }}
            className="p-1 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
          >
            <MoveUp className="w-3 h-3" />
          </button>
          <button
            title="Move Down"
            disabled={index === designerState.components.length - 1}
            onClick={(e) => {
              e.stopPropagation();
              handleMoveComponent(index, 'DOWN');
            }}
            className="p-1 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
          >
            <MoveDown className="w-3 h-3" />
          </button>
          <button
            title="Inspect / Edit"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedComponentId(item.id);
              setActiveInspectorTab('component');
            }}
            className="p-1 hover:bg-teal-50 text-teal-700 rounded cursor-pointer"
          >
            <Sliders className="w-3 h-3" />
          </button>
          <button
            title="Remove from Pass"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveComponent(item.id);
            }}
            className="p-1 hover:bg-red-50 text-red-600 rounded cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        {/* Drag handle */}
        <div className="absolute left-1 top-2 hidden group-hover:flex items-center text-slate-400 cursor-grab z-30">
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        {/* The Component's Rendered UI */}
        <div className="p-1">{content}</div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Mode Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-teal-700" />
            <h1 className="text-base font-bold text-slate-900">
              Interactive Badge & Visitor Pass Designer Studio
            </h1>
            <span className="text-[10px] font-mono bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-bold uppercase">
              Super Admin Pass Architecture
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select, drag and drop required components onto the pass canvas. Customize typography, physical dimensions, and access clearance.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSaveTemplate}
            className="bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Pass Template</span>
          </button>

          {onNavigateToSpooler && (
            <button
              onClick={onNavigateToSpooler}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Go to Print Spooler</span>
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-red-50 text-red-800 border-red-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main 3-Column Studio Grid:
          Column 1: Available Pass Components (Drag Palette) (3.5 Cols)
          Column 2: Visual WYSIWYG Pass Canvas (Drop Zone) (5 Cols)
          Column 3: Properties & Presets Inspector (3.5 Cols)
      */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Available Pass Components (Component Library) */}
        {/* ======================================================== */}
        <div className="xl:col-span-3 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col h-[750px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-700" />
                <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Pass Components ({AVAILABLE_PASS_COMPONENTS.length})
                </h2>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Drag or +Add</span>
            </div>

            {/* Search Input */}
            <div className="relative my-3">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-100 text-[10px]">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'IDENTITY', label: 'Identity' },
                { id: 'SECURITY', label: 'Security' },
                { id: 'VISIT_METADATA', label: 'Visit' },
                { id: 'BARCODES', label: 'Codes' },
                { id: 'COMPLIANCE', label: 'Safety' },
                { id: 'LAYOUT', label: 'Layout' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer whitespace-nowrap ${
                    categoryFilter === cat.id
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Draggable Component List */}
            <div className="flex-1 overflow-y-auto pt-3 space-y-2 pr-1">
              {filteredPaletteComponents.map((item) => {
                const Icon = item.icon;
                const onCanvas = isComponentOnCanvas(item.type);

                return (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={(e) => handlePaletteDragStart(e, item.type)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-teal-500 bg-white hover:bg-teal-50/20 transition shadow-2xs group flex items-start gap-2.5 cursor-grab active:cursor-grabbing"
                  >
                    <div className="p-1.5 rounded-md bg-slate-100 text-slate-700 group-hover:bg-teal-100 group-hover:text-teal-800 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-xs truncate">
                          {item.title}
                        </span>
                        {onCanvas && (
                          <span className="text-[9px] font-mono text-teal-800 bg-teal-50 px-1 py-0.2 rounded font-bold">
                            On Pass
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                        <span className="text-[9px] text-slate-400 font-mono">
                          {item.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddComponent(item.type)}
                          className="text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded transition flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredPaletteComponents.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  No pass components match your search.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Tip: Drag to canvas or click Add</span>
              <span className="font-mono">v2.4 Engine</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CENTER COLUMN: Pass Canvas (Visual Drag & Drop Workspace) */}
        {/* ======================================================== */}
        <div className="xl:col-span-5 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col h-[750px]">
            {/* Canvas Header & View Switchers */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-teal-700" />
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Pass Canvas: {designerState.orientation} ({designerState.components.length} Items)
                </span>
              </div>

              {/* Orientation & Zoom controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() =>
                      setDesignerState((prev) => ({
                        ...prev,
                        orientation: 'PORTRAIT',
                        widthMm: 85.6,
                        heightMm: 120
                      }))
                    }
                    className={`px-2 py-1 text-[10px] font-bold rounded transition cursor-pointer ${
                      designerState.orientation === 'PORTRAIT'
                        ? 'bg-white text-teal-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Portrait (Lanyard)
                  </button>
                  <button
                    onClick={() =>
                      setDesignerState((prev) => ({
                        ...prev,
                        orientation: 'LANDSCAPE',
                        widthMm: 101.6,
                        heightMm: 76.2
                      }))
                    }
                    className={`px-2 py-1 text-[10px] font-bold rounded transition cursor-pointer ${
                      designerState.orientation === 'LANDSCAPE'
                        ? 'bg-white text-teal-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Landscape (Clip)
                  </button>
                </div>

                <div className="flex items-center gap-1 text-slate-500">
                  <button
                    title="Zoom Out"
                    onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                    className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono">{zoomLevel}%</span>
                  <button
                    title="Zoom In"
                    onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                    className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Sample Visitor Selector */}
            <div className="py-2 px-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px] font-semibold flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-teal-700" />
                <span>Simulate Visitor Data:</span>
              </span>
              <select
                value={previewVisitId}
                onChange={(e) => setPreviewVisitId(e.target.value)}
                className="p-1 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:border-teal-600"
              >
                {state.visits.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.visitorName} ({v.visitorCompany})
                  </option>
                ))}
              </select>
            </div>

            {/* Scrollable Center Canvas Drop Zone */}
            <div
              className={`flex-1 overflow-y-auto p-4 flex flex-col items-center justify-start transition-all relative ${
                isDragOverCanvas ? 'bg-teal-50/50' : 'bg-slate-100/70'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOverCanvas(true);
              }}
              onDragLeave={() => setIsDragOverCanvas(false)}
              onDrop={(e) => handleCanvasDrop(e)}
            >
              {/* Actual Physical Badge Card Container */}
              <div
                id="interactive-pass-canvas"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  maxWidth: designerState.orientation === 'PORTRAIT' ? '340px' : '460px',
                  backgroundColor: designerState.cardBackground || '#FFFFFF'
                }}
                className={`w-full bg-white rounded-xl border-2 border-slate-300 shadow-xl overflow-hidden relative transition-all duration-200 ${
                  designerState.borderRadius === 'none'
                    ? 'rounded-none'
                    : designerState.borderRadius === 'sm'
                    ? 'rounded-sm'
                    : designerState.borderRadius === 'md'
                    ? 'rounded-md'
                    : designerState.borderRadius === 'xl'
                    ? 'rounded-xl'
                    : designerState.borderRadius === '2xl'
                    ? 'rounded-2xl'
                    : 'rounded-lg'
                }`}
              >
                {/* Security Watermark Background Pattern */}
                <div
                  className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden z-0"
                  style={{ opacity: designerState.watermarkOpacity }}
                >
                  <span className="text-3xl font-black text-slate-900 rotate-[-25deg] tracking-widest uppercase">
                    {designerState.watermarkText}
                  </span>
                </div>

                {/* Render All Components in Sequence */}
                <div className="relative z-10 flex flex-col p-2 space-y-1">
                  {designerState.components.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      {dropTargetIndex === idx && (
                        <div className="h-1 bg-teal-500 rounded-full my-1 animate-pulse" />
                      )}
                      {renderCanvasComponent(item, idx)}
                    </React.Fragment>
                  ))}

                  {/* Empty state if all items removed */}
                  {designerState.components.length === 0 && (
                    <div className="py-12 px-4 text-center border-2 border-dashed border-slate-300 rounded-xl space-y-3">
                      <Layout className="w-8 h-8 text-slate-400 mx-auto" />
                      <div>
                        <h4 className="font-bold text-slate-700 text-xs">Pass Canvas is Empty</h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Drag components from the left drawer or load a preset layout.
                        </p>
                      </div>
                      <button
                        onClick={() => loadPreset('STANDARD_CORPORATE')}
                        className="bg-teal-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        Load Default Pass Layout
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Physical Dimension Badge under Canvas */}
              <div className="mt-4 text-center">
                <span className="inline-block text-[11px] font-mono text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                  Physical Scale: {designerState.widthMm}mm × {designerState.heightMm}mm • {designerState.passType}
                </span>
              </div>
            </div>

            {/* Bottom Quick Tools */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setDesignerState((prev) => ({ ...prev, components: [] }))}
                className="text-slate-500 hover:text-red-600 text-[11px] font-semibold transition cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => loadPreset('STANDARD_CORPORATE')}
                className="text-teal-700 hover:text-teal-900 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Standard</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Properties & Presets Inspector */}
        {/* ======================================================== */}
        <div className="xl:col-span-4 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col h-[750px]">
            {/* Tabs for Inspector */}
            <div className="flex items-center gap-1 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveInspectorTab('component')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeInspectorTab === 'component'
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Component Settings
              </button>
              <button
                onClick={() => setActiveInspectorTab('pass')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeInspectorTab === 'pass'
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Card Styling
              </button>
              <button
                onClick={() => setActiveInspectorTab('presets')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeInspectorTab === 'presets'
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Presets & Save
              </button>
            </div>

            {/* TAB 1: Selected Component Properties */}
            {activeInspectorTab === 'component' && (
              <div className="flex-1 overflow-y-auto pt-3 space-y-4 text-xs pr-1">
                {selectedComponent ? (
                  <>
                    <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-950 text-xs">
                          {selectedComponent.title}
                        </span>
                        <span className="text-[9px] font-mono text-teal-800 bg-teal-200/60 px-1.5 py-0.2 rounded font-bold">
                          {selectedComponent.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-teal-700">
                        Customize appearance, alignment, and properties on the pass.
                      </p>
                    </div>

                    {/* Label / Custom Title */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Component Title / Label
                      </label>
                      <input
                        type="text"
                        value={selectedComponent.title}
                        onChange={(e) => updateSelectedComponentTitle(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                      />
                    </div>

                    {/* Alignment */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Horizontal Alignment
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['left', 'center', 'right'].map((align) => (
                          <button
                            key={align}
                            type="button"
                            onClick={() => updateSelectedComponentConfig({ align: align as any })}
                            className={`py-1.5 rounded-lg border text-xs font-semibold capitalize cursor-pointer transition ${
                              selectedComponent.config?.align === align
                                ? 'bg-teal-700 text-white border-teal-700'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Size (if text applicable) */}
                    {['visitor_name', 'visitor_company', 'custom_text', 'host_details'].includes(
                      selectedComponent.type
                    ) && (
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          Font Size
                        </label>
                        <select
                          value={selectedComponent.config?.fontSize || 'base'}
                          onChange={(e) =>
                            updateSelectedComponentConfig({ fontSize: e.target.value as any })
                          }
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                        >
                          <option value="xs">Extra Small (10px)</option>
                          <option value="sm">Small (12px)</option>
                          <option value="base">Regular (14px)</option>
                          <option value="lg">Large (18px)</option>
                          <option value="xl">Extra Large (22px)</option>
                        </select>
                      </div>
                    )}

                    {/* Custom Text Content */}
                    {[
                      'custom_text',
                      'escort_notice',
                      'safety_instructions',
                      'wifi_credentials',
                      'muster_point',
                      'emergency_hotline',
                      'watermark_seal'
                    ].includes(selectedComponent.type) && (
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          Custom Notice Text
                        </label>
                        <textarea
                          rows={3}
                          value={selectedComponent.config?.customText || ''}
                          onChange={(e) =>
                            updateSelectedComponentConfig({ customText: e.target.value })
                          }
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                        />
                      </div>
                    )}

                    {/* Photo Specific Config */}
                    {selectedComponent.type === 'visitor_photo' && (
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        <label className="block text-slate-700 font-semibold">Photo Frame Shape</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'rounded', label: 'Rounded' },
                            { id: 'circle', label: 'Circle' },
                            { id: 'square', label: 'Square' }
                          ].map((shape) => (
                            <button
                              key={shape.id}
                              type="button"
                              onClick={() =>
                                updateSelectedComponentConfig({ photoShape: shape.id as any })
                              }
                              className={`py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                                selectedComponent.config?.photoShape === shape.id
                                  ? 'bg-teal-700 text-white border-teal-700'
                                  : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              {shape.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* QR Specific Config */}
                    {selectedComponent.type === 'dynamic_qr' && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <label className="block text-slate-700 font-semibold">QR Dimension (px)</label>
                        <input
                          type="range"
                          min="70"
                          max="150"
                          step="5"
                          value={selectedComponent.config?.qrSize || 100}
                          onChange={(e) =>
                            updateSelectedComponentConfig({ qrSize: Number(e.target.value) })
                          }
                          className="w-full accent-teal-700"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>70px (Compact)</span>
                          <span>{selectedComponent.config?.qrSize || 100}px</span>
                          <span>150px (Prominent)</span>
                        </div>
                      </div>
                    )}

                    {/* Clearance Specific Config */}
                    {selectedComponent.type === 'security_clearance' && (
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        <label className="block text-slate-700 font-semibold">
                          Security Clearance Level
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { level: 'LOW', color: '#0F766E', label: 'Level 1: General' },
                            { level: 'MEDIUM', color: '#D97706', label: 'Level 2: Escorted' },
                            { level: 'HIGH', color: '#1E40AF', label: 'Level 3: Technical' },
                            { level: 'RESTRICTED', color: '#DC2626', label: 'Level 4: Vault/Lab' }
                          ].map((c) => (
                            <button
                              key={c.level}
                              type="button"
                              onClick={() =>
                                updateSelectedComponentConfig({
                                  clearanceLevel: c.level as any,
                                  clearanceColor: c.color
                                })
                              }
                              className={`p-2 rounded-lg border text-left text-xs font-semibold cursor-pointer transition ${
                                selectedComponent.config?.clearanceLevel === c.level
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: c.color }}
                                />
                                <span>{c.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Colors & Styles */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <label className="block text-slate-700 font-semibold">Color Accent</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedComponent.config?.color || '#0F172A'}
                          onChange={(e) => updateSelectedComponentConfig({ color: e.target.value })}
                          className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                        />
                        <span className="font-mono text-xs text-slate-600">
                          {selectedComponent.config?.color || '#0F172A'}
                        </span>
                      </div>
                    </div>

                    {/* Remove Action */}
                    <div className="pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleRemoveComponent(selectedComponent.id)}
                        className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Component from Pass</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <Sliders className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="font-semibold text-slate-600">No Component Selected</p>
                    <p className="text-[11px] text-slate-400">
                      Click any component on the canvas to inspect and edit its properties.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Pass Global Styling */}
            {activeInspectorTab === 'pass' && (
              <div className="flex-1 overflow-y-auto pt-3 space-y-4 text-xs pr-1">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Pass Template Name
                  </label>
                  <input
                    type="text"
                    value={designerState.templateName}
                    onChange={(e) =>
                      setDesignerState((prev) => ({ ...prev, templateName: e.target.value }))
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Hardware Form Factor Preset
                  </label>
                  <select
                    value={designerState.passType}
                    onChange={(e) =>
                      setDesignerState((prev) => ({
                        ...prev,
                        passType: e.target.value as any
                      }))
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600"
                  >
                    <option value="CR80_CARD">CR80 PVC Identity Card (85.6mm × 54mm)</option>
                    <option value="ADHESIVE_LABEL">Thermal Adhesive Label (101.6mm × 76.2mm)</option>
                    <option value="CONFERENCE_PASS">Oversized VIP Pass (100mm × 140mm)</option>
                    <option value="MOBILE_WALLET_PASS">Mobile Wallet Pass (Generic)</option>
                  </select>
                </div>

                {/* Header Stripe Color */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Header Stripe Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={designerState.headerBackground}
                      onChange={(e) =>
                        setDesignerState((prev) => ({
                          ...prev,
                          headerBackground: e.target.value
                        }))
                      }
                      className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                    />
                    <span className="font-mono text-xs text-slate-600">
                      {designerState.headerBackground}
                    </span>
                  </div>
                </div>

                {/* Card Background Color */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Card Background Tone
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: '#FFFFFF', label: 'Crisp White' },
                      { id: '#F8FAFC', label: 'Light Slate' },
                      { id: '#FEF3C7', label: 'High-Vis Amber' },
                      { id: '#F0FDFA', label: 'Teal Tint' }
                    ].map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() =>
                          setDesignerState((prev) => ({ ...prev, cardBackground: bg.id }))
                        }
                        className={`p-2 rounded-lg border text-center text-[10px] font-semibold cursor-pointer ${
                          designerState.cardBackground === bg.id
                            ? 'border-teal-700 ring-2 ring-teal-500'
                            : 'border-slate-200'
                        }`}
                        style={{ backgroundColor: bg.id }}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Corner Curvature
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'none', label: 'Squared' },
                      { id: 'lg', label: 'Rounded' },
                      { id: '2xl', label: 'Curved' }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() =>
                          setDesignerState((prev) => ({ ...prev, borderRadius: r.id as any }))
                        }
                        className={`py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                          designerState.borderRadius === r.id
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Watermark Text & Opacity */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-slate-700 font-semibold">
                    Anti-Counterfeit Watermark Text
                  </label>
                  <input
                    type="text"
                    value={designerState.watermarkText}
                    onChange={(e) =>
                      setDesignerState((prev) => ({ ...prev, watermarkText: e.target.value }))
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Watermark Opacity:</span>
                    <span className="font-mono">
                      {Math.round(designerState.watermarkOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.25"
                    step="0.01"
                    value={designerState.watermarkOpacity}
                    onChange={(e) =>
                      setDesignerState((prev) => ({
                        ...prev,
                        watermarkOpacity: Number(e.target.value)
                      }))
                    }
                    className="w-full accent-teal-700"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Presets & Actions */}
            {activeInspectorTab === 'presets' && (
              <div className="flex-1 overflow-y-auto pt-3 space-y-4 text-xs pr-1">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Enterprise Layout Presets
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Load pre-configured security templates with balanced component hierarchies.
                  </p>

                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => loadPreset('STANDARD_CORPORATE')}
                      className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-teal-600 text-left bg-slate-50 hover:bg-white transition cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 text-xs">
                        Standard Tata Corporate Pass
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        CR80 PVC format, photo, dynamic express QR, host info & NDA instructions.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => loadPreset('CONTRACTOR_SAFETY')}
                      className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-amber-600 text-left bg-slate-50 hover:bg-white transition cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 text-xs text-amber-900">
                        Contractor High-Vis Safety Pass
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        High-vis yellow adhesive sticker, mandatory safety escort banner, muster point.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => loadPreset('EXECUTIVE_VIP')}
                      className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-purple-600 text-left bg-slate-50 hover:bg-white transition cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 text-xs text-purple-900">
                        Executive VIP All-Access Card
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Dark luxury aesthetic, circular photo frame, unescorted clearance, VIP Wi-Fi.
                      </div>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Actions & Export
                  </h4>

                  <button
                    onClick={handleSaveTemplate}
                    className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Template to System</span>
                  </button>

                  <button
                    onClick={() => {
                      try {
                        generateVisitorPassPdf(previewVisit, activeTenant, activeSite, { autoDownload: true });
                        setFeedback({ type: 'success', message: 'Pass PDF generated & downloaded.' });
                        setTimeout(() => setFeedback(null), 3000);
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Export Designed Pass as PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      const jsonStr = JSON.stringify(designerState, null, 2);
                      navigator.clipboard.writeText(jsonStr);
                      setFeedback({ type: 'success', message: 'Template JSON copied to clipboard.' });
                      setTimeout(() => setFeedback(null), 3000);
                    }}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Template Schema JSON</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
