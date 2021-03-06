import { invariant } from '@apollo/client/utilities/globals';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
} from 'react';
import useCookie from 'react-use-cookie';

import type { ChannelDetailsFragment } from '../generated/graphql';
import type { GetServerAllPagesCtx } from '../lib/getServerAllPagesCtx';
import type { ReactNode } from 'react';

interface AllPagesContextValue {
	allPagesCtx: GetServerAllPagesCtx;
	userChannel: {
		channels: ReadonlyArray<ChannelDetailsFragment>;
		defaultChannel: ChannelDetailsFragment | undefined;
		selectedChannel: ChannelDetailsFragment;
		setSelectedChannelSlug: (value: string) => void;
	};
}
const AllPagesContext = createContext<AllPagesContextValue | null>(null);
AllPagesContext.displayName = 'AllPagesContext';

export const useAllPagesContext = () => {
	const ctx = useContext(AllPagesContext);

	invariant(ctx, `Missing AllPagesContextProvider`);

	return ctx;
};

interface AllPagesContextProviderProps {
	children: ReactNode;
	allPagesCtx: GetServerAllPagesCtx;
}
export const AllPagesContextProvider = ({
	children,
	allPagesCtx,
}: AllPagesContextProviderProps) => {
	const channels = useMemo(
		() => allPagesCtx.channels.channels || [],
		[allPagesCtx.channels.channels],
	);
	const defaultChannel = channels[0];

	const [cookieChannelSlug, setCookieChannelSlug] = useCookie(
		`CURRENCY`,
		defaultChannel?.slug,
	);

	const setSelectedChannelSlug = useCallback(
		(value: string) => {
			setCookieChannelSlug(value, { days: 365 });
		},
		[setCookieChannelSlug],
	);

	useEffect(() => {
		// trigger save of the default value
		setSelectedChannelSlug(cookieChannelSlug);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- trigger only once
	}, []);

	const value = useMemo(
		() => ({
			allPagesCtx,
			userChannel: {
				channels,
				defaultChannel,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it has to be true
				selectedChannel: channels.find((c) => c.slug === cookieChannelSlug)!,
				setSelectedChannelSlug,
			},
		}),
		[
			allPagesCtx,
			channels,
			defaultChannel,
			cookieChannelSlug,
			setSelectedChannelSlug,
		],
	);

	return (
		<AllPagesContext.Provider value={value}>
			{children}
		</AllPagesContext.Provider>
	);
};
