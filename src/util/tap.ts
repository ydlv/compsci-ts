export function tap<T>(self: T, callback: (self: T) => any) {
	callback(self);
	return self;
}
