const MONGO = process.env.MONGO_PORT_27017_TCP_ADDR ? `${process.env.MONGO_ENV_MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_ENV_MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_PORT_27017_TCP_ADDR}:${process.env.MONGO_PORT_27017_TCP_PORT}` : NULL
if(MONGO) const OTHER = "authSource=admin"

exports = module.exports = {
	MONGODB: MONGO || process.env.MONGODB || "localhost",
	MONGODB_OTHER: process.env.MONGODB_OTHER || "",
	PORT: process.env.PORT || 2012,
	SECRET: process.env.SECRET || "94f3eee0-218f-41fc-9318-94cf5430fc7f"
};
