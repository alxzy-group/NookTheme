import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHdd, faMemory, faMicrochip, faServer } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';
import Spinner from '@/components/elements/Spinner';

// Komponen Stat (Info Teks)
const Stat = memo(({ icon, usage, label }: { icon: any; usage: string; label: string }) => (
    <div>
        <div css={tw`flex items-center text-sm text-neutral-200`}>
            <FontAwesomeIcon icon={icon} css={tw`w-4 h-4 mr-2 text-neutral-400`} />
            <span css={tw`font-semibold tracking-wide`}>{label}</span>
        </div>
        <p css={tw`text-xs text-neutral-400 mt-1 ml-6 font-mono`}>{usage}</p>
    </div>
), isEqual);

// Komponen Progress Bar dengan Gradien
const ProgressBar = memo(({ usage, limit }: { usage: number; limit: number }) => {
    const percent = limit > 0 ? Math.min((usage / limit) * 100, 100) : 0;
    const isAlarm = percent >= 90;

    return (
        <div css={tw`h-1.5 bg-neutral-700 rounded-full mt-1 ml-6`}>
            <div
                css={[
                    tw`h-1.5 rounded-full transition-all duration-300`,
                    isAlarm
                        ? tw`bg-gradient-to-r from-orange-500 to-red-500`
                        : tw`bg-gradient-to-r from-cyan-400 to-blue-500`,
                ]}
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}, isEqual);

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server, className?: string }) => {
    const [stats, setStats] = useState<ServerStats | null>(null);
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;

    useEffect(() => {
        if (server.status === 'suspended' || server.isTransferring) {
            return;
        }
        const getStats = () => {
            getServerResourceUsage(server.uuid)
                .then(data => setStats(data))
                .catch(error => console.error(error));
        };
        getStats();
        interval.current = setInterval(getStats, 30000);
        return () => {
            clearInterval(interval.current);
        };
    }, [server.uuid, server.status, server.isTransferring]);

    const memoryUsed = bytesToString(stats?.memoryUsageInBytes ?? 0);
    const memoryLimit = server.limits.memory === 0 ? 'Unlimited' : bytesToString(mbToBytes(server.limits.memory));
    const diskUsed = bytesToString(stats?.diskUsageInBytes ?? 0);
    const diskLimit = server.limits.disk === 0 ? 'Unlimited' : bytesToString(mbToBytes(server.limits.disk));
    const cpuUsage = stats?.cpuUsagePercent.toFixed(2) ?? '0.00';
    const cpuLimit = server.limits.cpu > 0 ? `/ ${server.limits.cpu}%` : '∞';
    const isSuspended = server.status === 'suspended' || stats?.isSuspended;
    const status = isSuspended ? 'suspended' : (stats?.status || server.status);
    const isTransitioning = status === 'starting' || status === 'stopping';

    return (
        <Link
            to={`/server/${server.id}`}
            className={className}
            css={tw`
                block bg-neutral-900 p-4 rounded-lg shadow-lg
                border border-transparent hover:border-cyan-500
                transition-all duration-200 ease-in-out
                transform hover:scale-105
                flex flex-col
            `}
        >
            <div css={tw`flex items-start mb-4`}>
                <div css={tw`relative flex-shrink-0`}>
                    <FontAwesomeIcon icon={faServer} css={tw`text-neutral-300 text-3xl`} />
                    <div
                        css={[
                            tw`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-900`,
                            status === 'running' && tw`bg-green-500`,
                            status === 'offline' && tw`bg-red-500`,
                            status === 'suspended' && tw`bg-red-500`,
                            isTransitioning && tw`bg-yellow-500 animate-pulse`,
                        ]}
                    />
                </div>
                <div css={tw`flex-1 ml-4 truncate`}>
                    <p css={tw`text-lg font-semibold text-neutral-50 truncate`}>{server.name}</p>
                    <p css={tw`text-xs text-neutral-400 truncate`}>{server.node}</p>
                </div>
            </div>

            <div css={tw`flex-grow space-y-4`}>
                {!stats || isSuspended ? (
                    <div css={tw`flex items-center justify-center h-full`}>
                        {isSuspended ? (
                            <span css={tw`bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-400 rounded px-2 py-1 text-xs font-semibold`}>
                                Suspended
                            </span>
                        ) : (
                            <Spinner size="small" />
                        )}
                    </div>
                ) : (
                    <>
                        <div>
                            <Stat icon={faMicrochip} usage={`${cpuUsage}% ${cpuLimit}`} label="CPU Usage" />
                            <ProgressBar usage={stats.cpuUsagePercent} limit={server.limits.cpu} />
                        </div>
                        <div>
                            <Stat icon={faMemory} usage={`${memoryUsed} / ${memoryLimit}`} label="Memory Usage" />
                            <ProgressBar usage={stats.memoryUsageInBytes} limit={mbToBytes(server.limits.memory)} />
                        </div>
                        <div>
                            <Stat icon={faHdd} usage={`${diskUsed} / ${diskLimit}`} label="Disk Usage" />
                            <ProgressBar usage={stats.diskUsageInBytes} limit={mbToBytes(server.limits.disk)} />
                        </div>
                    </>
                )}
            </div>
        </Link>
    );
};
