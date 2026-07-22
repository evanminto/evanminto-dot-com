declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;
	export type CollectionEntry<C extends keyof AnyEntryMap> = Flatten<AnyEntryMap[C]>;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"art": {
"blue-in-moonlight.md": {
	id: "blue-in-moonlight.md";
  slug: "blue-in-moonlight";
  body: string;
  collection: "art";
  data: any
} & { render(): Render[".md"] };
"freshly-cut.md": {
	id: "freshly-cut.md";
  slug: "freshly-cut";
  body: string;
  collection: "art";
  data: any
} & { render(): Render[".md"] };
"g-robo-and-cyberpunks.md": {
	id: "g-robo-and-cyberpunks.md";
  slug: "g-robo-and-cyberpunks";
  body: string;
  collection: "art";
  data: any
} & { render(): Render[".md"] };
"last-train.md": {
	id: "last-train.md";
  slug: "last-train";
  body: string;
  collection: "art";
  data: any
} & { render(): Render[".md"] };
"metroid-2.md": {
	id: "metroid-2.md";
  slug: "metroid-2";
  body: string;
  collection: "art";
  data: any
} & { render(): Render[".md"] };
"self-portrait-2020 copy.md": {
	id: "self-portrait-2020 copy.md";
  slug: "self-portrait-2020-copy";
  body: string;
  collection: "art";
  data: any
} & { render(): Render[".md"] };
"self-portrait-2020.md": {
	id: "self-portrait-2020.md";
  slug: "self-portrait-2020";
  body: string;
  collection: "art";
  data: any
} & { render(): Render[".md"] };
"wake-up.md": {
	id: "wake-up.md";
  slug: "wake-up";
  body: string;
  collection: "art";
  data: any
} & { render(): Render[".md"] };
"warning-label.md": {
	id: "warning-label.md";
  slug: "warning-label";
  body: string;
  collection: "art";
  data: any
} & { render(): Render[".md"] };
"winter-walk.md": {
	id: "winter-walk.md";
  slug: "winter-walk";
  body: string;
  collection: "art";
  data: any
} & { render(): Render[".md"] };
};
"blog": {
"cutting-the-ribbon-on-my-personal-blog.md": {
	id: "cutting-the-ribbon-on-my-personal-blog.md";
  slug: "cutting-the-ribbon-on-my-personal-blog";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"intrinsically-responsive-css-grid-minmax-min.md": {
	id: "intrinsically-responsive-css-grid-minmax-min.md";
  slug: "intrinsically-responsive-css-grid-minmax-min";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"responsive-floats-using-switcher-expression.md": {
	id: "responsive-floats-using-switcher-expression.md";
  slug: "responsive-floats-using-switcher-expression";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
};
"case-studies": {
"azuki-discover-screen.md": {
	id: "azuki-discover-screen.md";
  slug: "azuki-discover-screen";
  body: string;
  collection: "case-studies";
  data: any
} & { render(): Render[".md"] };
"azuki-manga-reader.md": {
	id: "azuki-manga-reader.md";
  slug: "azuki-manga-reader";
  body: string;
  collection: "case-studies";
  data: any
} & { render(): Render[".md"] };
"gogov-request-dashboard.md": {
	id: "gogov-request-dashboard.md";
  slug: "gogov-request-dashboard";
  body: string;
  collection: "case-studies";
  data: any
} & { render(): Render[".md"] };
"promare-title-generator.md": {
	id: "promare-title-generator.md";
  slug: "promare-title-generator";
  body: string;
  collection: "case-studies";
  data: any
} & { render(): Render[".md"] };
};
"games": {
"deadline.md": {
	id: "deadline.md";
  slug: "deadline";
  body: string;
  collection: "games";
  data: any
} & { render(): Render[".md"] };
"drained.md": {
	id: "drained.md";
  slug: "drained";
  body: string;
  collection: "games";
  data: any
} & { render(): Render[".md"] };
"friendship-fighter.md": {
	id: "friendship-fighter.md";
  slug: "friendship-fighter";
  body: string;
  collection: "games";
  data: any
} & { render(): Render[".md"] };
"helicopter-mom.md": {
	id: "helicopter-mom.md";
  slug: "helicopter-mom";
  body: string;
  collection: "games";
  data: any
} & { render(): Render[".md"] };
"next-one.md": {
	id: "next-one.md";
  slug: "next-one";
  body: string;
  collection: "games";
  data: any
} & { render(): Render[".md"] };
"waluigi-simulator.md": {
	id: "waluigi-simulator.md";
  slug: "waluigi-simulator";
  body: string;
  collection: "games";
  data: any
} & { render(): Render[".md"] };
};
"landing-pages": {
"more.md": {
	id: "more.md";
  slug: "more";
  body: string;
  collection: "landing-pages";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = never;
}
