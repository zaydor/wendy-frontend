import { Base } from '@/api/models/base';

export interface ImageProps {
	height: number;
	width: number;
	url: string;
}

export class Image extends Base implements ImageProps {
	height: number;
	width: number;
	url: string;

	constructor({ height, width, url }: ImageProps) {
		super();
		this.height = height;
		this.width = width;
		this.url = url;
	}

	static from_json(json_data: Record<string, unknown>): Image {
		return new Image({
			height: json_data.height as number,
			width: json_data.width as number,
			url: json_data.url as string,
		});
	}
}
