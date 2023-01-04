const provincesIsEmpty = () => ({ provinces: { equals: [] } });

const provincesContainsId = (id) => ({ provinces: { in: id } });

const appliesToProvince = (id) => ({
    or: [provincesIsEmpty(), provincesContainsId(id)],
});

const getQuestionsForProvince = async (req, provinceId) => {
    const cms = req.payload;
    const found = await cms.find({
        collection: 'questions',
        where: appliesToProvince(provinceId),
    });
    return found;
};

export const  handleQuestionRequest = async (req, res, _next) => {
    const questions = await getQuestionsForProvince(
        req,
        req.params.province
    );
    if (questions) {
        res.status(200).send({ questions });
    } else {
        res.status(404).send({ error: 'not found' });
    }
};
