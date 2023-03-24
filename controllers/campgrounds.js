const Campgrounds = require('../models/campground');
const { cloudinary } = require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


//CREATE 
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campgrounds.location,
        limit: 1
    }).send();
    const campground = new Campgrounds(req.body.campgrounds);
    campground.images = req.files.map(f => ({ url: f.path, name: f.filename }));
    campground.author = req.user; //req.user berasal dari passport
    campground.geometry = geoData.body.features[0].geometry;
    await campground.save();
    req.flash('success', 'successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

//READ
module.exports.showAllCampgrounds = async (req, res, next) => {
    const campgrounds = await Campgrounds.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;

    const campground = await Campgrounds.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    //nested populate

    if (!campground) {
        req.flash('error', 'Cannot find campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

//UPDATE
module.exports.renderUpdateForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campgrounds.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campgrounds.findByIdAndUpdate(id, req.body.campgrounds);
    imgs = req.files.map(f => ({ url: f.path, name: f.filename }));
    campground.images.push(...imgs);

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { name: { $in: req.body.deleteImages } } } });
    }

    await campground.save();
    req.flash('success', 'successfully update a campground');
    res.redirect(`/campgrounds/${id}`);
}

//DELETE 
module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campgrounds.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted a campground');
    res.redirect('/campgrounds');
}
