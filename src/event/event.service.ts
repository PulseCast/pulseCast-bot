import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
// import NodeCache from 'node-cache';
import * as NodeCache from 'node-cache';

@Injectable()
export class EventService {
  private BASE_URL = process.env.MARKET_BASE_URL;
  private cache = new NodeCache({ stdTTL: 18000 }); // 5 hrs

  constructor(private readonly httpService: HttpService) {}

  //   async getCategories(): Promise<{ id: string; name: string }[]> {
  //     const cached = this.cache.get<{ id: string; name: string }[]>('categories');
  //     if (cached) {
  //       console.log('✅ Categories fetched from cache');
  //       console.log(cached.length);
  //       return cached;
  //     }

  //     try {
  //       const { data } = await firstValueFrom(
  //         this.httpService.get(`${this.BASE_URL}/categories`),
  //       );

  //       // Filter out categories that have a parentCategory
  //       const topLevelCategories = data.filter((c: any) => !c.parentCategory);

  //       this.cache.set('categories', topLevelCategories, 18000); // 5 hours
  //       console.log('✅ Categories fetched from Polymarket');
  //       console.log(topLevelCategories.length);
  //       return topLevelCategories;
  //     } catch (error: any) {
  //       console.error('❌ Error fetching categories:', error.message);
  //       const fallback =
  //         this.cache.get<{ id: string; name: string }[]>('categories');
  //       if (fallback) return fallback;
  //       throw new Error(
  //         'Failed to fetch categories and no cached version available',
  //       );
  //     }
  //   }

  //   async getCategories(): Promise<{ id: string; name: string }[]> {
  //     const cached = this.cache.get<{ id: string; name: string }[]>('categories');
  //     if (cached) {
  //       console.log('✅ Categories fetched from cache');
  //       console.log(cached.length);
  //       return cached;
  //     }

  //     try {
  //       const { data } = await firstValueFrom(
  //         this.httpService.get(`${this.BASE_URL}/categories`),
  //       );
  //       this.cache.set('categories', data, 18000); // 5 hours
  //       console.log('✅ Categories fetched from Polymarket');
  //       console.log(data.length);
  //       return data;
  //     } catch (error) {
  //       console.error('❌ Error fetching categories:', error.message);
  //       const fallback =
  //         this.cache.get<{ id: string; name: string }[]>('categories');
  //       if (fallback) return fallback;
  //       throw new Error(
  //         'Failed to fetch categories and no cached version available',
  //       );
  //     }
  //   }

  async getCategories(): Promise<any[]> {
    const cached = this.cache.get<any[]>('categories');
    if (cached) {
      console.log('✅ Categories fetched from cache');
      console.log(cached.length);
      return cached;
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.BASE_URL}/categories`),
      );

      const priorityLabels = ['Sports', 'Pop Culture', 'Crypto', 'Politics'];

      const topLevelMap = new Map<string, any>();
      const childrenMap = new Map<string, any[]>();

      // Separate top-level categories and group children by parentCategory
      for (const cat of data) {
        if (!cat.parentCategory) {
          topLevelMap.set(cat.id, cat);
        } else {
          if (!childrenMap.has(cat.parentCategory)) {
            childrenMap.set(cat.parentCategory, []);
          }
          childrenMap.get(cat.parentCategory)!.push(cat);
        }
      }

      const sortedCategories: any[] = [];

      // Add priority top-level categories and their children
      for (const label of priorityLabels) {
        const topLevelCat = [...topLevelMap.values()].find(
          (c) => c.label && c.label.toLowerCase() === label.toLowerCase(),
        );
        if (topLevelCat) {
          sortedCategories.push(topLevelCat);
          const children = childrenMap.get(topLevelCat.id) || [];
          sortedCategories.push(...children);
          // Remove from maps to avoid duplicates
          topLevelMap.delete(topLevelCat.id);
          childrenMap.delete(topLevelCat.id);
        }
      }

      // Add remaining top-level categories and their children
      for (const [id, cat] of topLevelMap.entries()) {
        sortedCategories.push(cat);
        const children = childrenMap.get(id) || [];
        sortedCategories.push(...children);
      }

      this.cache.set('categories', sortedCategories, 18000); // 5 hours
      console.log('✅ Categories fetched from Polymarket and sorted');
      console.log(sortedCategories.length);
      return sortedCategories;
    } catch (error: any) {
      console.error('❌ Error fetching categories:', error.message);
      const fallback = this.cache.get<any[]>('categories');
      if (fallback) return fallback;
      throw new Error(
        'Failed to fetch categories and no cached version available',
      );
    }
  }
}
