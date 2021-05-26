<template>
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Progress</th>
				<th>Size</th>
				<th>Peers</th>
				<th>Download</th>
				<th>Time</th>
				<th>Upload</th>
				<th>Uploaded</th>
				<th>Ratio</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="torrent in torrents"
				:key="torrent.infoHash"
				:class="{ selected: selectedTorrent === torrent }"
				@click="selectedTorrent = torrent"
			>
				<td>{{ torrent.name }}</td>
				<td>
					<progress :value="torrent.progress" max="1"
						>{{ (torrent.progress * 100).toFixed(3) }}%</progress
					>{{ (torrent.progress * 100).toFixed(3) }}%
				</td>
				<td>{{ prettyBytes(torrent.size) }}</td>
				<td>{{ torrent.peers }}</td>
				<td>{{ prettyBytes(torrent.downloadSpeed) }}</td>
				<td>{{ prettyMs(torrent.timeRemaining) }}</td>
				<td>{{ prettyBytes(torrent.uploadSpeed) }}</td>
				<td>{{ prettyBytes(torrent.uploaded) }}</td>
				<td>{{ torrent.ratio.toFixed(3) }}</td>
			</tr>
		</tbody>
	</table>
	<torrent-details v-if="selectedTorrent" :torrent="selectedTorrent" />
</template>

<script>
import bytes from "bytes";
import prettyMilliseconds from "pretty-ms";
import TorrentDetails from "./TorrentDetails";

export default {
	components: {
		TorrentDetails,
	},
	props: ["torrents"],
	data() {
		return { selectedTorrent: null };
	},
	methods: {
		prettyBytes(byte) {
			return bytes(byte);
		},
		prettyMs(ms) {
			return prettyMilliseconds(ms);
		},
	},
};
</script>

<style>
table {
	width: 100%;
	text-align: center;
}

tr:hover {
	background-color: #337cba22;
}

.selected {
	background-color: #337cba55;
}
</style>
