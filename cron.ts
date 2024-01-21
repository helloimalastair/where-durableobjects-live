console.log("Starting Cron Job");
setInterval(async () => {
	console.log("Cron Triggered");
	await fetch("http://localhost:8787");
}, 3e5);