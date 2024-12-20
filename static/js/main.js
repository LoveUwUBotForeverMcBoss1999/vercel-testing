document.addEventListener('DOMContentLoaded', function() {
    const updateStats = async () => {
        try {
            const response = await fetch('/api/stats');
            const stats = await response.json();
            
            // Update header with only proxy player count
            const proxyStats = stats['Proxy'] || { players: 0, max_players: 0 };
            document.getElementById('current-players').textContent = proxyStats.players;
            document.getElementById('max-players').textContent = proxyStats.max_players;
            
            const serverGrid = document.getElementById('server-grid');
            serverGrid.innerHTML = '';
            
            Object.entries(stats).forEach(([serverName, serverData]) => {
                // Replace "Proxy" with "Network" in the display name
                const displayName = serverName === 'Proxy' ? 'Network' : serverName;
                
                const serverCard = document.createElement('div');
                serverCard.className = 'server-card';
                serverCard.innerHTML = `
                    <h3 class="server-name">${displayName}</h3>
                    <div class="server-status">
                        <span class="status-indicator ${serverData.online ? 'status-online' : 'status-offline'}"></span>
                        <span>${serverData.online ? 'Online' : 'Offline'}</span>
                    </div>
                    <div class="server-players">
                        ${serverData.players}/${serverData.max_players} Players
                    </div>
                `;
                serverGrid.appendChild(serverCard);
            });
        } catch (error) {
            console.error('Error fetching server stats:', error);
        }
    };

    // Update stats initially and every 30 seconds
    updateStats();
    setInterval(updateStats, 30000);

    // IP Copy functionality
    document.getElementById('copy-ip').addEventListener('click', function() {
        navigator.clipboard.writeText('mc.mnsnetwork.xyz').then(() => {
            const button = this;
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="ip">Copied!</span>';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        });
    });
});
