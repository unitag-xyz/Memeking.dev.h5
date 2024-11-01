export function EvalScale(sourceWidth, sourceHeight, targetWidth, targetHeight) {
	console.log("sWidth:+" + sourceWidth + " sHeight:" + sourceHeight + " tWidth:" + targetWidth + " tHeight:" +
		targetHeight);
	var scaleFactor = sourceWidth / sourceHeight > targetWidth / targetHeight ?
		sourceHeight / targetHeight :
		sourceWidth / targetWidth;
	return scaleFactor;
};

export function DegreeToRadians(degree) {
	return degree * Math.PI / 180.0;
}

export function RadiansToDegree(radian) {
	return radian / Math.PI * 180.0;
}

export var Vec2 = /** @class */ (function() {
	function Vec2(x, y) { 
		this.X = x;
		this.Y = y;
	}
	Vec2.Zero = function() {
		return new Vec2(0.0, 0.0);
	};
	Vec2.Center = function() {
		return new Vec2(0.5, 0.5);
	};
	Vec2.prototype.Add = function(diff) {
		this.X += diff.X;
		this.Y += diff.Y;
		return this;
	};
	Vec2.prototype.Subtract = function(diff) {
		this.X -= diff.X;
		this.Y -= diff.Y;
		return this;
	};
	Vec2.prototype.CopyFrom = function(value) {
		this.X = value.X;
		this.Y = value.Y;
	};
	Vec2.prototype.Clone = function() {
		return new Vec2(this.X, this.Y);
	};
	Vec2.prototype.Equals = function(vec) {
		return this.X == vec.X && this.Y == vec.Y;
	};
	Vec2.prototype.ToPov2 = function() {
		return new Pov2(Math.sqrt(this.X * this.X + this.Y * this.Y), Math.atan2(this.Y, this.X));
	};
	Vec2.prototype.Distance = function(other) {
		let temp = this.Clone().Subtract(other);
		return Math.sqrt(temp.X * temp.X + temp.Y * temp.Y);
	};
	Vec2.Create = function(jObj) {
		var vec = new Vec2(0.0, 0.0);
		if (jObj.x)
			vec.X = jObj.x;
		if (jObj.y)
			vec.Y = jObj.y;
		return vec;
	};
	return Vec2;
}());

export var Pov2 = /** @class */ (function() {
	function Pov2(radius, angle) { 
		this.Raidus = radius;
		this.Angle = angle;
	}
	Pov2.Zero = function() {
		return new Pov2(0.0, 0.0);
	};
	Pov2.prototype.Rotate = function(angle) {
		this.Angle += angle;
		return this;
	};
	Pov2.prototype.CopyFrom = function(value) {
		this.Angle = value.Angle;
		this.Raidus = value.Raidus;
	};
	Pov2.prototype.Clone = function() {
		return new Pov2(this.Angle, this.Raidus);
	};
	Pov2.prototype.Equals = function(other) {
		return this.Raidus == other.Raidus && this.Angle == other.Angle;
	};
	Pov2.prototype.ToVec2 = function() {
		return new Vec2(this.Raidus * Math.cos(this.Angle), this.Raidus * Math.sin(this.Angle));
	};
	return Pov2;
}());

export var Size = /** @class */ (function () {
    function Size(width, height) { 
        this.Width = width;
        this.Height = height;
    }
    Size.Empty = function () { return new Size(0.0, 0.0); };
    Size.Original = function () { return new Size(1.0, 1.0); };
    Size.prototype.IsEmpty = function () { return this.Width <= 0.0 || this.Height <= 0.0; };
    Object.defineProperty(Size.prototype, "WHRatio", {
        get: function () { return this.Width / this.Height; },
        enumerable: false,
        configurable: true
    });
    Size.prototype.CopyFrom = function (value) {
        this.Width = value.Width;
        this.Height = value.Height;
    };
    Size.prototype.Clone = function () {
        return new Size(this.Width, this.Height);
    };
    Size.prototype.Equals = function (size) {
        return this.Width == size.Width && this.Height == size.Height;
    };
    Size.Multiply = function (size, mul) { return new Size(size.Width * mul, size.Height * mul); };
    return Size;
}());


export var Parameters = /** @class */ (function() {
	function Parameters() {}
	Parameters.canvasWidth = 0;
	Parameters.canvasHeight = 0;
	return Parameters;
}());

export var Rect = /** @class */ (function () {
    function Rect(origin, size) { 
        this.Size = size;
        this.Origin = origin;
    }
    Rect.Empty = function () { return Rect.CreateAsCenter(0.0, 0.0, 0.0, 0.0); };
    Rect.CreateAsCenter = function (x, y, width, height) { return new Rect(new Vec2(x - width * 0.5, y - height * 0.5), new Size(width, height)); };
    Rect.prototype.IsContainsPoint = function (point) {
        return (point.X >= this.Origin.X) &&
            (point.X <= this.Origin.X + this.Size.Width) &&
            (point.Y >= this.Origin.Y) &&
            (point.Y <= this.Origin.Y + this.Size.Height);
    };
    Rect.prototype.GetOffset = function (point) {
        return new Vec2(point.X - this.Origin.X, point.Y - this.Origin.Y);
    };
    Rect.prototype.GetIntersectRect = function (rect) {
        var ret = Rect.Empty();
        var minx0 = this.Origin.X;
        var miny0 = this.Origin.Y;
        var maxx0 = minx0 + this.Size.Width;
        var maxy0 = miny0 + this.Size.Height;
        var minx1 = rect.Origin.X;
        var miny1 = rect.Origin.Y;
        var maxx1 = minx1 + rect.Size.Width;
        var maxy1 = miny1 + rect.Size.Height;
        var minx = Math.max(minx0, minx1);
        var miny = Math.max(miny0, miny1);
        var maxx = Math.min(maxx0, maxx1);
        var maxy = Math.min(maxy0, maxy1);
        if (minx < maxx && miny < maxy) {
            ret.Origin.X = minx;
            ret.Origin.Y = miny;
            ret.Size.Width = maxx - minx;
            ret.Size.Height = maxy - miny;
        }
        return ret;
    };
    return Rect;
}());

//module.exports = {evalScale, Pov2, Vec2}
