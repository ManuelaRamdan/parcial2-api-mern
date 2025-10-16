

const paginate = async (Model, req, { query = {}, sort = { _id: 1 } } = {}) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    if (page < 1 || limit < 1) {
        const error = new Error("Página y límite deben ser números positivos");
        error.statusCode = 400;
        throw error;
    }

    const totalDocs = await Model.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    if (page > totalPages && totalPages > 0) {
        const error = new Error("Página fuera de rango");
        error.statusCode = 400;
        throw error;
    }

    const data = await Model.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort);

    return {
        data,
        pagination: {
            totalDocs,
            totalPages,
            currentPage: page,
            limit,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
        },
    };
};

module.exports = paginate;
