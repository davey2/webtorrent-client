<template>
	<add-torrent v-model:torrents="torrents" />
	<create-torrent v-model:torrents="torrents" />
	<torrents :torrents="torrents" />
</template>

<script>
import AddTorrent from "./components/AddTorrent";
import CreateTorrent from "./components/CreateTorrent";
import Torrents from "./components/Torrents";

export default {
	data() {
		return { torrents: [] };
	},
	components: {
		AddTorrent,
		Torrents,
		CreateTorrent,
	},
};
</script>
