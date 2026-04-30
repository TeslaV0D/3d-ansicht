import type { Asset, AssetTemplate } from '../types';
import { ASSET_TEMPLATES } from './assetTemplates';

let idCounter = 0;

function generateId(): string {
  idCounter++;
  return `asset-${Date.now()}-${idCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

export class AssetFactory {
  static getTemplates(): AssetTemplate[] {
    return ASSET_TEMPLATES;
  }

  static getTemplate(templateId: string): AssetTemplate | undefined {
    return ASSET_TEMPLATES.find((t) => t.id === templateId);
  }

  static getCategories(): string[] {
    const categories = new Set(ASSET_TEMPLATES.map((t) => t.category));
    return Array.from(categories);
  }

  static getTemplatesByCategory(category: string): AssetTemplate[] {
    return ASSET_TEMPLATES.filter((t) => t.category === category);
  }

  static createInstance(
    templateId: string,
    position: [number, number, number],
  ): Asset | null {
    const template = this.getTemplate(templateId);
    if (!template) return null;

    const asset: Asset = {
      id: generateId(),
      templateId: template.id,
      type: template.category === 'Zonen' ? 'zone' : template.category === 'Wege & Markierungen' ? 'way' : template.category === 'Schilder & Labels' ? 'label' : 'primitive',
      category: template.category,
      position,
      rotation: [0, 0, 0],
      scale: [...template.defaultScale],
      geometry: { ...template.geometry },
      color: template.defaultColor,
      visual: {
        opacity: template.defaultVisual.opacity ?? 1,
        roughness: template.defaultVisual.roughness ?? 0.5,
        metalness: template.defaultVisual.metalness ?? 0,
        emissive: '#000000',
        flatShading: false,
        wireframe: false,
        castShadow: template.category !== 'Zonen' && template.category !== 'Wege & Markierungen',
        receiveShadow: template.category === 'Zonen' || template.category === 'Wege & Markierungen',
        decals: [],
      },
      metadata: {
        name: template.defaultMetadata.name ?? template.label,
        description: template.defaultMetadata.description ?? '',
        zoneType: template.defaultMetadata.zoneType ?? '',
        customRows: [],
        presentationNotes: '',
      },
      locked: false,
      visible: true,
    };

    return asset;
  }

  static searchTemplates(query: string): AssetTemplate[] {
    const lower = query.toLowerCase();
    return ASSET_TEMPLATES.filter(
      (t) =>
        t.label.toLowerCase().includes(lower) ||
        t.tags.some((tag) => tag.includes(lower)) ||
        t.category.toLowerCase().includes(lower),
    );
  }
}
