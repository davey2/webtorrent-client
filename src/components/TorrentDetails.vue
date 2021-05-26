<template>
	<p>Hash: {{ torrent.infoHash }}</p>
	<p>Magnet URI: {{ torrent.magnetURI }}</p>
	<p>
		Torrent file:
		<a :href="torrent.torrentFile" :download="torrent.name + '.torrent'"
			>{{ torrent.name }}.torrent</a
		>
	</p>
	<p>Files:</p>
	<ul>
		<li v-for="file in torrent.files" :key="file">
			<a v-if="file.url" :href="file.url" :download="file.name"
				>{{ file.path }} ({{ (file.progress * 100).toFixed(3) }}%)</a
			>
			<p v-else>{{ file.path }} ({{ (file.progress * 100).toFixed(3) }}%)</p>
		</li>
	</ul>
</template>

<script>
export default {
	props: ["torrent"],
};
</script>
