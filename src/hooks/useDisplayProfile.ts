'use client';

import { useMemo } from 'react';
import { useStellarUser } from '@/hooks/useStellarUser';
import { useProfile } from '@/hooks/useProfile';
import { avatarById, type AvatarId } from '@/lib/avatars';

export type DisplayProfile = {
  authenticated: boolean;
  ready: boolean;
  address: string | null;
  email: string | null;
  /** User-chosen username if set, otherwise email handle / short address. */
  displayName: string;
  /** First token of displayName, suitable for greetings. */
  firstName: string;
  /** Single uppercase letter for fallback initial avatars. */
  initial: string;
  /** Two-character initials for compact bubbles. */
  initials: string;
  /** Whether the user has set a username explicitly. */
  hasCustomName: boolean;
  /** Selected avatar id (e.g. 'planet'). null when none chosen. */
  avatarId: AvatarId | null;
  /** Glyph for the chosen avatar, or null when 'initial' / unset. */
  avatarGlyph: string | null;
};

function shortAddress(addr: string): string {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

function getInitials(name: string): string {
  const src = name.trim();
  if (!src) return '';
  const parts = src.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

export function useDisplayProfile(): DisplayProfile {
  const { authenticated, ready, address, email } = useStellarUser();
  const { profile } = useProfile();

  return useMemo(() => {
    const username = profile?.username?.trim() ?? '';
    const fallback = email
      ? email.split('@')[0]
      : address
        ? shortAddress(address)
        : 'Astronomer';
    const displayName = username.length > 0 ? username : fallback;
    const firstName = displayName.split(/[@\s]/)[0] || displayName;
    const initial = (displayName[0] ?? '✦').toUpperCase();
    const initials = getInitials(displayName) || initial;
    const avatarRaw = (profile?.avatar ?? null) as AvatarId | null;
    const def = avatarRaw ? avatarById(avatarRaw) : null;
    const avatarGlyph = def && def.id !== 'initial' ? def.glyph : null;
    return {
      authenticated,
      ready,
      address,
      email,
      displayName,
      firstName,
      initial,
      initials,
      hasCustomName: username.length > 0,
      avatarId: avatarRaw,
      avatarGlyph,
    };
  }, [authenticated, ready, address, email, profile]);
}
