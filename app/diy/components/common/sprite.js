import {
	Vec2,
	EvalScale,
	DegreeToRadians,
	RadiansToDegree,
	Size
} from "./drawing.js"

let spriteId = 0;

export var ImageSprite = /** @class */ (function() {
	function ImageSprite(imageSource, scaleFactor = 0.6) {
		this.id = ++spriteId;
		this.image = imageSource;
		this.contentSize = new Size(this.image.width,this.image.height) 
		this.pos = Vec2.Center();
		this.rotation = 0.0;
		this.isSelected = false;
		this.scale = EvalScale(ImageSprite.canvasSize.Width * scaleFactor, ImageSprite.canvasSize.Height * scaleFactor, this.contentSize.Width, this.contentSize.Height);
		console.log("scale:" + this.scale);
	}
	ImageSprite.canvasSize = Size.Empty(); 
	ImageSprite.dpr = 1.0;
	ImageSprite.prototype.translateToLocal = function(pos) {
		let translatePoint = pos.Clone();
		if (this.rotation != 0.0) {
			let offsetVec2 = new Vec2(translatePoint.X - this.pos.X * ImageSprite.canvasSize.Width, translatePoint.Y - this.pos.Y *
				ImageSprite.canvasSize.Height); //中间距离
			let radian = DegreeToRadians(this.rotation);
			translatePoint = offsetVec2.ToPov2().Rotate(-radian).ToVec2();
			translatePoint.X = translatePoint.X / this.scale + 0.5 * this.contentSize.Width;
			translatePoint.Y = translatePoint.Y / this.scale + 0.5 * this.contentSize.Height;
		} else {
			translatePoint.X = (translatePoint.X - this.pos.X * ImageSprite.canvasSize.Width) / this.scale + 0.5 * this.contentSize.Width; //左边距离
			translatePoint.Y = (translatePoint.Y - this.pos.Y * ImageSprite.canvasSize.Height) / this.scale + 0.5 * this.contentSize.Height; // 下边距离 
		}
		return translatePoint;
	};
	ImageSprite.prototype.hitTest = function(pos) {
		let translatePoint = this.translateToLocal(pos);
		if (translatePoint.X > 0 && translatePoint.X < this.contentSize.Width &&
			translatePoint.Y > 0 && translatePoint.Y < this.contentSize.Height) {
			return true;
		} else {
			return false;
		}
	};
	ImageSprite.prototype.singleTouchBegin = function(p0) {
		this.p0 = p0;
	};
	ImageSprite.prototype.singleTouchMove = function(p0) {
		let op0 = this.translateToLocal(this.p0);
		let np0 = this.translateToLocal(p0);

		let diffP0Pov = np0.Clone().Subtract(op0).ToPov2()
		diffP0Pov.Rotate(DegreeToRadians(this.rotation));
		let diffP0 = diffP0Pov.ToVec2();
		this.pos.X += diffP0.X * this.scale / ImageSprite.canvasSize.Width;
		this.pos.Y += diffP0.Y * this.scale / ImageSprite.canvasSize.Height;

		this.p0 = p0;
	};
	ImageSprite.prototype.singleTouchEnd = function() {
		this.p0 = null;
	};
	ImageSprite.prototype.multiTouchBegin = function(p0, p1) {
		this.p0 = p0 //this.translateToLocal(p0);
		this.p1 = p1 //this.translateToLocal(p1);
	};
	ImageSprite.prototype.multiTouchMove = function(p0, p1) {
		let op0 = this.translateToLocal(this.p0);

		let diffScale = p0.Distance(p1) / this.p0.Distance(this.p1);
		this.scale *= diffScale;

		let oldPov = this.p0.Clone().Subtract(this.p1).ToPov2();
		let newPov = p0.Clone().Subtract(p1).ToPov2();
		let diffRot = -RadiansToDegree(oldPov.Angle - newPov.Angle)
		this.rotation += diffRot;

		let np0 = this.translateToLocal(p0);
		let diffP0Pov = np0.Clone().Subtract(op0).ToPov2()
		diffP0Pov.Rotate(DegreeToRadians(this.rotation));
		let diffP0 = diffP0Pov.ToVec2();
		this.pos.X += diffP0.X * this.scale / ImageSprite.canvasSize.Width;
		this.pos.Y += diffP0.Y * this.scale / ImageSprite.canvasSize.Height;

		this.p0 = p0;
		this.p1 = p1;
	}
	ImageSprite.prototype.multiTouchEnd = function() {
		this.p0 = null;
		this.p1 = null;
	};
	ImageSprite.prototype.move = function(diff) {
		console.log("diff x:" + diff.X + " y:" + diff.Y);
		this.pos.X += diff.X / ImageSprite.canvasSize.Width;
		this.pos.Y += diff.Y / ImageSprite.canvasSize.Height;
	};
	ImageSprite.prototype.draw = function(ctx) {
		ctx.save();
		ctx.translate(this.pos.X * ImageSprite.canvasSize.Width / ImageSprite.dpr, this.pos.Y * ImageSprite.canvasSize.Height /
			ImageSprite.dpr);
		ctx.rotate(DegreeToRadians(this.rotation));
		let destWidth = this.contentSize.Width * this.scale / ImageSprite.dpr;
		let destHeight = this.contentSize.Height * this.scale / ImageSprite.dpr;
		ctx.drawImage(this.image, 0, 0, this.contentSize.Width, this.contentSize.Height, -destWidth * 0.5, -destHeight * 0.5, destWidth,
			destHeight);
		if (this.isSelected) {
			ctx.beginPath();
			ctx.lineWidth = Math.ceil(0.5 * ImageSprite.dpr);
			ctx.globalCompositeOperation = "xor";
			ctx.rect(-destWidth * 0.5, -destHeight * 0.5, destWidth, destHeight);
			ctx.strokeStyle = "#000000";
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(-destWidth * 0.5, 0);
			ctx.lineTo(destWidth * 0.5, 0);
			ctx.moveTo(0, -destHeight * 0.5);
			ctx.lineTo(0, destHeight * 0.5);
			ctx.stroke();
		}
		ctx.restore();
	};
	return ImageSprite;
}());

export var TextSprite = /** @class */ (function() {
	function TextSprite(font) {
		if (font == undefined || font == null || font == "")
			font = "sans-serif";
		this.id = ++spriteId;
		this.text = "";
		this.font = font;
		this.fontSize = 10;
		this.fontColor = {
			"r": 51,
			"g": 51,
			"b": 51,
			"a": 1
		};
		this.contentSize = new Size(0, this.fontSize * TextSprite.dpr);
		this.pos = Vec2.Center();
		this.rotation = 0.0;
		this.isSelected = false;
	}
	TextSprite.canvasSize = Size.Empty();  
	TextSprite.dpr = 1.0;

	TextSprite.prototype.updateText = function(ctx, text) {
		this.text = text;
		this.remeasureText(ctx);
	}

	TextSprite.prototype.updateFont = function(ctx, font) {
		this.font = font;
		this.remeasureText(ctx);
	}

	TextSprite.prototype.remeasureText = function(ctx) {
		ctx.save();
		ctx.textBaseline = "middle";
		ctx.fillStyle = "rgb(" + this.fontColor.r + "," + this.fontColor.g + "," + this.fontColor.b + ")";
		ctx.font = this.fontSize * TextSprite.dpr + "px " + this.font;
		this.contentSize.Width = ctx.measureText(this.text).width;
		this.contentSize.Height = this.fontSize * TextSprite.dpr;
		ctx.restore()
	}

	TextSprite.prototype.translateToLocal = function(pos) {
		let translatePoint = pos.Clone();
		if (this.rotation != 0.0) {
			let offsetVec2 = new Vec2(translatePoint.X - this.pos.X * TextSprite.canvasSize.Width, translatePoint.Y - this.pos.Y *
				TextSprite.canvasSize.Height); //中间距离
			let radian = DegreeToRadians(this.rotation);
			translatePoint = offsetVec2.ToPov2().Rotate(-radian).ToVec2();
			translatePoint.X = translatePoint.X / TextSprite.dpr + 0.5 * this.contentSize.Width
			translatePoint.Y = translatePoint.Y / TextSprite.dpr + 0.5 * this.contentSize.Height;
		} else {
			translatePoint.X = (translatePoint.X - this.pos.X * TextSprite.canvasSize.Width) / TextSprite.dpr + 0.5 * this.contentSize
				.Width; //左边距离
			translatePoint.Y = (translatePoint.Y - this.pos.Y * TextSprite.canvasSize.Height) / TextSprite.dpr + 0.5 * this.contentSize
				.Height; // 下边距离 
		}
		// translatePoint.X /= TextSprite.dpr;
		// translatePoint.Y /= TextSprite.dpr;
		return translatePoint;
	};
	TextSprite.prototype.hitTest = function(pos) {
		let translatePoint = this.translateToLocal(pos);
		console.log("translatePoint.X:" + translatePoint.X + " translatePoint.Y:" + translatePoint.Y +
			" this.contentSize.Width:" + this.contentSize.Width + " this.contentSize.Height:" + this.contentSize.Height);
		if (translatePoint.X > 0 && translatePoint.X < this.contentSize.Width &&
			translatePoint.Y > 0 && translatePoint.Y < this.contentSize.Height) {
			return true;
		} else {
			return false;
		}
	};
	TextSprite.prototype.singleTouchBegin = function(p0) {
		this.p0 = p0;
	};
	TextSprite.prototype.singleTouchMove = function(p0) {
		let op0 = this.translateToLocal(this.p0);
		let np0 = this.translateToLocal(p0);

		let diffP0Pov = np0.Clone().Subtract(op0).ToPov2()
		diffP0Pov.Rotate(DegreeToRadians(this.rotation));
		let diffP0 = diffP0Pov.ToVec2();
		this.pos.X += diffP0.X * TextSprite.dpr / TextSprite.canvasSize.Width;
		this.pos.Y += diffP0.Y * TextSprite.dpr / TextSprite.canvasSize.Height;

		this.p0 = p0;
	};
	TextSprite.prototype.singleTouchEnd = function() {
		this.p0 = null;
	};
	TextSprite.prototype.multiTouchBegin = function(p0, p1) {
		this.p0 = p0 //this.translateToLocal(p0);
		this.p1 = p1 //this.translateToLocal(p1);
	};
	TextSprite.prototype.multiTouchMove = function(p0, p1) {
		let op0 = this.translateToLocal(this.p0);

		let diffScale = p0.Distance(p1) / this.p0.Distance(this.p1);
		this.fontSize *= diffScale;


		let oldPov = this.p0.Clone().Subtract(this.p1).ToPov2();
		let newPov = p0.Clone().Subtract(p1).ToPov2();
		let diffRot = -RadiansToDegree(oldPov.Angle - newPov.Angle)
		this.rotation += diffRot;

		let np0 = this.translateToLocal(p0);
		let diffP0Pov = np0.Clone().Subtract(op0).ToPov2()
		diffP0Pov.Rotate(DegreeToRadians(this.rotation));
		let diffP0 = diffP0Pov.ToVec2();
		this.pos.X += diffP0.X * TextSprite.dpr / TextSprite.canvasSize.Width;
		this.pos.Y += diffP0.Y * TextSprite.dpr / TextSprite.canvasSize.Height;

		this.contentSize.Width *= diffScale;
		this.contentSize.Height *= diffScale;

		this.p0 = p0;
		this.p1 = p1;
	}
	TextSprite.prototype.multiTouchEnd = function() {
		this.p0 = null;
		this.p1 = null;
	};
	TextSprite.prototype.move = function(diff) {
		console.log("diff x:" + diff.X + " y:" + diff.Y);
		this.pos.X += diff.X / TextSprite.canvasSize.Width;
		this.pos.Y += diff.Y / TextSprite.canvasSize.Height;
	};
	TextSprite.prototype.draw = function(ctx) {
		ctx.save();
		ctx.translate(this.pos.X * TextSprite.canvasSize.Width / TextSprite.dpr, this.pos.Y * TextSprite.canvasSize.Height /
			TextSprite.dpr);
		ctx.rotate(DegreeToRadians(this.rotation));
		let destWidth = this.contentSize.Width
		let destHeight = this.contentSize.Height
		ctx.textBaseline = "middle";
		ctx.fillStyle = "rgb(" + this.fontColor.r + "," + this.fontColor.g + "," + this.fontColor.b + ")";
		ctx.globalAlpha = this.fontColor.a;
		ctx.font = this.fontSize * TextSprite.dpr + "px " + this.font;

		// console.log("this.pos.X:" + this.pos.X + " this.pos.Y" + this.pos.Y + " TextSprite.canvasSize.Width:" + TextSprite.canvasSize.Width +
		// 	" TextSprite.dpr:" + TextSprite.dpr + " destWidth:" + destWidth + "destHeight:" + destHeight);

		ctx.fillText(this.text, -destWidth * 0.5, 0);
		if (this.isSelected) {
			ctx.beginPath();
			ctx.lineWidth = Math.ceil(0.5 * TextSprite.dpr);
			ctx.globalCompositeOperation = "xor";
			ctx.rect(-destWidth * 0.5, -destHeight * 0.5, destWidth, destHeight);
			ctx.strokeStyle = "#808080";
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(-destWidth * 0.5, 0);
			ctx.lineTo(destWidth * 0.5, 0);
			ctx.moveTo(0, -destHeight * 0.5);
			ctx.lineTo(0, destHeight * 0.5);
			ctx.stroke();
		}
		ctx.restore();
	};
	return TextSprite;
}());
