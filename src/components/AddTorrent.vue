<template>
	<button @click="showModal = true">Add torrent</button>
	<modal v-if="showModal">
		<template v-slot:header>
			<h2>Add torrent</h2>
		</template>
		<template v-slot:body>
			<p>Torrent file(s)</p>
			<input
				type="file"
				@change="selectTorrentFile"
				accept="application/x-bittorrent,.torrent"
			/>

			<p>Magnet URI or info hash or url to torrent file</p>
			<input type="text" v-model="torrentId" />

			<div v-if="loading">
				<p>Loading...</p>
				<img
					width="40"
					height="40"
					src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
				/>
			</div>
		</template>
		<template v-slot:footer>
			<button @click="showModal = false">Close</button>
			<button @click="addTorrent">Add torrent</button>
		</template>
	</modal>
</template>

<script>
import { reactive } from "vue";
import Modal from "./Modal";

export default {
	props: ["torrents"],
	data() {
		return {
			showModal: false,
			torrentFile: null,
			torrentId: "",
			loading: false,
		};
	},
	components: { Modal },
	model: { prop: "torrents", event: "updateTorrents" },
	methods: {
		selectTorrentFile(event) {
			this.torrentFile = event.target.files[0];
		},
		addTorrent() {
			this.loading = true;
			this.client.add(this.torrentFile || this.torrentId, (torrent) => {
				console.log(torrent);

				this.showModal = false;
				this.loading = false;

				const torrents = this.torrents;

				const torrentData = reactive({
					infoHash: torrent.infoHash,
					magnetURI: torrent.magnetURI,
					name: torrent.name,
					progress: torrent.progress,
					ratio: torrent.ratio,
					peers: torrent.numPeers,
					size: torrent.length,
					torrentFile: torrent.torrentFileBlobURL,
					timeRemaining: 0,
					files: [],
				});

				torrent.files.forEach((file) => {
					const newFile = {
						path: file.path,
						name: file.name,
						size: file.length,
					};
					torrentData.files.push(newFile);

					file.getBlobURL((err, url) => {
						if (err) throw err;
						newFile.url = url;
					});
				});

				torrents.push(torrentData);

				this.$emit("updateTorrents", torrents);

				torrent.on("download", () => {
					torrentData.progress = torrent.progress;
					torrentData.downloadSpeed = torrent.downloadSpeed;
					torrentData.ratio = torrent.ratio;
					torrentData.timeRemaining = torrent.timeRemaining;

					torrentData.files.forEach((file) => {
						const findFile = torrent.files.find(
							(item) => item.path == file.path
						);
						file.progress = findFile.progress;
					});
				});

				torrent.on("upload", () => {
					torrentData.uploadSpeed = torrent.uploadSpeed;
					torrentData.uploaded = torrent.uploaded;
					torrentData.ratio = torrent.ratio;
				});

				torrent.on("wire", () => {
					torrentData.peers = torrent.numPeers;
				});
			});
		},
	},
};
</script>
