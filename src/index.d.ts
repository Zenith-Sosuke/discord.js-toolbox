import {
  GuildMember,
  User,
  TextChannel,
  VoiceChannel,
  PermissionResolvable,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  GuildChannel,
} from 'discord.js';

// ─── Existing: Embeds ─────────────────────────────────────────────────────────

export interface CustomEmbedOptions {
  title?: string;
  description?: string;
  color?: number;
  footer?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  thumbnail?: string;
  image?: string;
}

export function successEmbed(description: string, title?: string): EmbedBuilder;
export function errorEmbed(description: string, title?: string): EmbedBuilder;
export function warnEmbed(description: string, title?: string): EmbedBuilder;
export function infoEmbed(description: string, title?: string): EmbedBuilder;
export function loadingEmbed(description: string, title?: string): EmbedBuilder;
export function customEmbed(options: CustomEmbedOptions): EmbedBuilder;

// ─── Existing: Moderation ─────────────────────────────────────────────────────

export interface CanModerateResult {
  ok: boolean;
  reason?: string;
}

export function canModerate(target: GuildMember, executor: GuildMember): CanModerateResult;
export function safeBan(member: GuildMember, reason?: string, deleteMessageDays?: number): Promise<void>;
export function safeKick(member: GuildMember, reason?: string): Promise<void>;
export function safeTimeout(member: GuildMember, durationMs: number, reason?: string): Promise<void>;
export function dmUser(member: GuildMember, embed: EmbedBuilder): Promise<boolean>;
export function parseDuration(input: string): number;
export function formatDuration(ms: number): string;

// ─── Existing: Pagination ─────────────────────────────────────────────────────

export interface PaginateOptions {
  timeout?: number;
  ephemeral?: boolean;
}

export function paginate(interaction: any, embeds: EmbedBuilder[], options?: PaginateOptions): Promise<void>;
export function chunkArray<T>(array: T[], size: number): T[][];

// ─── Existing: Formatters ─────────────────────────────────────────────────────

export type TimestampStyle = 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R';

export function truncate(str: string, maxLength: number): string;
export function titleCase(str: string): string;
export function formatNumber(n: number): string;
export function formatBytes(bytes: number): string;
export function discordTimestamp(date: Date, style?: TimestampStyle): string;
export function codeBlock(code: string, language?: string): string;
export function inlineCode(text: string): string;
export function mention(userId: string): string;
export function channelMention(channelId: string): string;
export function roleMention(roleId: string): string;

// ─── Existing: Validators ─────────────────────────────────────────────────────

export function isValidId(id: string): boolean;
export function isValidUrl(url: string): boolean;
export function isImageUrl(url: string): boolean;
export function isValidHex(hex: string): boolean;
export function hexToInt(hex: string): number;
export function hasPermissions(member: GuildMember, perms: PermissionResolvable[]): boolean;
export function getMissingPermissions(member: GuildMember, perms: PermissionResolvable[]): string[];
export function isInRange(str: string, min: number, max: number): boolean;
export function inNumericRange(n: number, min: number, max: number): boolean;

// ─── Existing: Permissions ────────────────────────────────────────────────────

export function isOwner(member: GuildMember): boolean;
export function isAdmin(member: GuildMember): boolean;
export function isModerator(member: GuildMember): boolean;
export function botHasChannelPerm(channel: GuildChannel, perm: PermissionResolvable): boolean;
export function botMissingChannelPerms(channel: GuildChannel, perms: PermissionResolvable[]): string[];

// ─── Existing: Time ───────────────────────────────────────────────────────────

export function timeAgo(date: Date): string;
export function accountAge(user: User): string;
export function memberAge(member: GuildMember): string;
export function shortDate(date: Date): string;
export function fullDate(date: Date): string;
export function addDuration(date: Date, ms: number): Date;
export function toUnix(date: Date): number;

// ─── Existing: Cooldowns & Errors ─────────────────────────────────────────────

export interface CooldownCheckResult {
  onCooldown: boolean;
  remaining: number;
}

export class CooldownManager {
  check(commandName: string, userId: string, cooldownMs: number): CooldownCheckResult;
  clear(commandName: string, userId: string): void;
}

export class PermissionError extends Error {}
export class UserNotFoundError extends Error {}
export class InvalidArgumentError extends Error {
  constructor(message: string);
}
export class CooldownError extends Error {
  remaining: number;
  constructor(remaining: number);
}

// ─── NEW: Logging ─────────────────────────────────────────────────────────────

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

export interface LoggerOptions {
  name?: string;
  level?: LogLevel;
  timestamps?: boolean;
  colors?: boolean;
}

export interface Logger {
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
  /** Start a timer. Call the returned function when done. */
  time(label: string): () => void;
}

export function createLogger(options?: LoggerOptions): Logger;
export const logger: Logger;

// ─── NEW: Builders ────────────────────────────────────────────────────────────

export interface ButtonOptions {
  customId?: string;
  label?: string;
  style?: ButtonStyle;
  emoji?: string | { id: string; name: string };
  url?: string;
  disabled?: boolean;
}

export interface ConfirmRowOptions {
  confirmId?: string;
  cancelId?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface SelectMenuOptionData {
  label: string;
  value: string;
  description?: string;
  emoji?: string;
  default?: boolean;
}

export interface SelectMenuOptions {
  customId: string;
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  options: SelectMenuOptionData[];
}

export interface ModalFieldOptions {
  customId: string;
  label: string;
  style?: 'short' | 'paragraph';
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  value?: string;
}

export interface ModalOptions {
  customId: string;
  title: string;
  fields: ModalFieldOptions[];
}

export interface CardOptions {
  title: string;
  thumbnail?: string;
  image?: string;
  color?: number;
  footer?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
}

export function buildButton(options: ButtonOptions): ButtonBuilder;
export function buildRow(...components: (ButtonBuilder | StringSelectMenuBuilder)[]): ActionRowBuilder<any>;
export function buildConfirmRow(options?: ConfirmRowOptions): ActionRowBuilder<any>;
export function disableRow(row: ActionRowBuilder<any>): ActionRowBuilder<any>;
export function buildSelectMenu(options: SelectMenuOptions): StringSelectMenuBuilder;
export function buildModal(options: ModalOptions): ModalBuilder;
export function buildCard(options: CardOptions): EmbedBuilder;
export function buildFieldPages(
  fields: { name: string; value: string; inline?: boolean }[],
  baseOptions?: Omit<CardOptions, 'fields'>,
  fieldsPerPage?: number
): EmbedBuilder[];

// ─── NEW: Components V2 ───────────────────────────────────────────────────────

import {
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ThumbnailBuilder,
  MediaGalleryBuilder,
  FileBuilder,
} from 'discord.js';

export interface V2ReplyOptions {
  ephemeral?: boolean;
  files?: any[];
  [key: string]: any;
}

export interface V2ButtonAccessory {
  customId: string;
  label: string;
  style?: ButtonStyle;
  emoji?: string | { id: string; name: string };
}

export interface V2SectionOptions {
  text: string | string[];
  button?: V2ButtonAccessory;
  thumbnail?: ThumbnailBuilder;
}

export interface V2ThumbnailOptions {
  url: string;
  altText?: string;
  spoiler?: boolean;
}

export interface V2MediaGalleryItem {
  url: string;
  altText?: string;
  spoiler?: boolean;
}

export interface V2ContainerOptions {
  accentColor?: number;
  spoiler?: boolean;
}

export interface V2InfoCardOptions {
  body: string;
  header?: string;
  footer?: string;
  color?: number;
}

export interface V2ProfileCardField {
  label: string;
  value: string;
}

export interface V2ProfileCardOptions {
  title: string;
  avatarUrl: string;
  lines?: string[];
  fields?: V2ProfileCardField[];
  color?: number;
}

/** Spread into interaction.reply() or channel.send() to enable Components V2. */
export function v2Reply(components: any[], extra?: V2ReplyOptions): { components: any[]; flags: number };

export function buildTextDisplay(content: string): TextDisplayBuilder;
export function buildSeparator(options?: { divider?: boolean; spacing?: 'small' | 'large' }): SeparatorBuilder;
export function buildThumbnail(options: V2ThumbnailOptions): ThumbnailBuilder;
export function buildSection(options: V2SectionOptions): SectionBuilder;
export function buildMediaGallery(items: V2MediaGalleryItem[]): MediaGalleryBuilder;
export function buildFile(url: string, spoiler?: boolean): FileBuilder;
export function buildContainer(builderFn: (c: ContainerBuilder) => ContainerBuilder, options?: V2ContainerOptions): ContainerBuilder;

export function v2InfoCard(options: V2InfoCardOptions): ContainerBuilder;
export function v2ProfileCard(options: V2ProfileCardOptions): ContainerBuilder;

// ─── NEW: Random ──────────────────────────────────────────────────────────────

export function randomChoice<T>(arr: T[]): T;
export function randomSample<T>(arr: T[], n: number): T[];
export function shuffle<T>(arr: T[]): T[];
export function randomInt(min: number, max: number): number;
export function chance(probability: number): boolean;

// ─── NEW: Retry ───────────────────────────────────────────────────────────────

export interface RetryOptions {
  attempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  factor?: number;
  jitter?: boolean;
  shouldRetry?: (err: Error, attempt: number) => boolean;
  onRetry?: (err: Error, attempt: number, delay: number) => void;
}

export function retry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>;
export function sleep(ms: number): Promise<void>;

// ─── NEW: Sanitize ────────────────────────────────────────────────────────────

export interface SanitizeInputOptions {
  maxLength?: number;
  escapeMarkdown?: boolean;
  fallback?: string;
}

export function escapeMarkdown(str: string): string;
export function stripMarkdown(str: string): string;
export function stripAnsi(str: string): string;
export function sanitizeInput(input: string, options?: SanitizeInputOptions): string;
export function maskSecret(str: string, visible?: number): string;
export function normalizeWhitespace(str: string): string;