let isClient = typeof window !== "undefined";

module.exports = {
	isClient,
	isServer: !isClient,
};
