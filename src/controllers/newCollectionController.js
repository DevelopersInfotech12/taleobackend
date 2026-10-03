import NewCollectionSection from "../models/NewCollectionSection.js";
import { success } from "../utils/apiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const TEXT_FIELDS = [
    "imageAlt",
    "eyebrow",
    "headingMain",
    "headingAccent",
    "body",
    "primaryButtonLabel",
    "primaryButtonHref",
    "secondaryButtonLabel",
    "secondaryButtonHref",
];

const getSingleton = async () => {
    let doc = await NewCollectionSection.findOne();
    if (!doc) doc = await NewCollectionSection.create({});
    return doc;
};

const parsePills = (raw) => {
    let arr = raw;
    if (typeof raw === "string") {
        try { arr = JSON.parse(raw); } catch { arr = raw.split(","); }
    }
    if (!Array.isArray(arr)) return null;
    return arr.map((p) => String(p).trim()).filter(Boolean);
};

export const getNewCollection = asyncHandler(async (_req, res) => {
    const doc = await NewCollectionSection.findOne();
    success(res, doc, "New collection section fetched");
});

export const updateNewCollection = asyncHandler(async (req, res) => {
    const doc = await getSingleton();

    for (const f of TEXT_FIELDS) {
        if (req.body[f] !== undefined) doc[f] = req.body[f];
    }

    if (req.body.pills !== undefined) {
        const pills = parsePills(req.body.pills);
        if (pills) doc.pills = pills;
    }

    if (req.file) {
        const r = await uploadToCloudinary(req.file.buffer, "taleo/new-collection");
        doc.image = r.secure_url;
    } else if (req.body.removeImage === "true") {
        doc.image = "";
    }

    await doc.save();
    success(res, doc, "New collection section updated");
});