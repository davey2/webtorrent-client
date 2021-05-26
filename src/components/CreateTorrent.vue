<template>
	<button @click="showModal = true">Create torrent</button>
	<modal v-if="showModal">
		<template v-slot:header>
			Create torrent
		</template>
		<template v-slot:body>
			Select file(s)
			<input type="file" multiple @change="addFiles" />
			Selected files
			<ul>
				<li v-for="file in files" :key="file">{{ file.name }}</li>
			</ul>

			<div v-if="loading">
				<p>Creating...</p>
				<img
					width="40"
					height="40"
					src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
				/>
			</div>
		</template>
		<template v-slot:footer>
			<button @click="showModal = false">Close</button>
			<button @click="createTorrent">Create torrent</button>
		</template>
	</modal>
</template>

<script>
import { reactive } from "vue";
import Modal from "./Modal";

export default {
	props: ["torrents"],
	model: { prop: "torrents", event: "updateTorrents" },
	data() {
		return { showModal: false, files: [], loading: false };
	},
	components: { Modal },
	methods: {
		addFiles(event) {
			const files = event.target.files;
			this.files = [...this.files, ...files];
			console.log(this.files);
		},
		createTorrent() {
			this.loading = true;
			this.client.seed(this.files, (torrent) => {
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
						progress: file.progress,
					};
					torrentData.files.push(newFile);

					file.getBlobURL((err, url) => {
						if (err) throw err;
						newFile.url = url;
					});
				});

				torrents.push(torrentData);

				this.$emit("updateTorrents", torrents);

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
