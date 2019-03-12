const chai = require('chai');
const chaiHttp = require('chai-http');

const { ObjectId } = require('mongoose').Types;

const mockDb = require('../../mock/mockDb');
const {
  mockSpec,
  nextMockSpec,
  mockSpecCreateJson,
  nextMockSpecCreateJson,
  getJsonFromMockSpec,
} = require('../../mock/mockSpec');
const { nextMockObjectId } = require('../../mock/mockObjectId');

const app = require('../../../app');

const { Spec } = require('../../../api/models/spec');
const {
  getSpecKeys,
  getParamsFromSpec,
} = require('../../../api/models/spec/utils');
const Type = require('../../../api/models/type');
const Param = require('../../../api/models/spec/param');

const { expect } = chai;

chai.use(chaiHttp);

describe('Specs', () => {
  before(async () => {
    await mockDb.setup();
  });

  after(async () => {
    await mockDb.teardown();
  });

  beforeEach(async () => {
    await Spec.deleteMany();
  });

  describe('/PUT Specs', () => {
    it('It should fail to PUT a Spec (missing required keys)', async () => {
      const specJson = '';

      const res = await chai.request(app)
        .put('/specs')
        .set('Content-Type', 'application/json')
        .send(specJson);

      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
    });

    it('It should fail to PUT a Spec (invalid keys)', async () => {
      const specJson = JSON.stringify({
        type: Type.ACI,
        extra: true,
      });

      const res = await chai.request(app)
        .put('/specs')
        .set('Content-Type', 'application/json')
        .send(specJson);

      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
    });

    it('It should fail to PUT a Spec (invalid type)', async () => {
      const specJson = mockSpecCreateJson('invalid', {});

      const res = await chai.request(app)
        .put('/specs')
        .set('Content-Type', 'application/json')
        .send(specJson);

      expect(res).to.have.status(400);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
    });

    it('It should fail to PUT a Spec (invalid param values)', async () => {
      const specJsons = [];
      specJsons.push(mockSpecCreateJson(Type.ACI, {
        minFreq: -1,
        maxFreq: Param.aci.maxFreq.max + 1,
        j: 0,
        fftW: 'Thats not an integer',
      }));
      specJsons.push(mockSpecCreateJson(Type.ADI, {
        maxFreq: {},
        dbThreshold: Param.adi.dbThreshold.min - 1,
        freqStep: Param.adi.freqStep.max + 1,
        shannon: false,
      }));
      specJsons.push(mockSpecCreateJson(Type.AEI, {
        maxFreq: -1,
        dbThreshold: Param.aei.dbThreshold.min - 1,
        freqStep: null,
      }));
      specJsons.push(mockSpecCreateJson(Type.BI, {
        minFreq: -1,
        maxFreq: -1,
        fftW: 0,
      }));
      specJsons.push(mockSpecCreateJson(Type.NDSI, {
        fftW: -1,
        anthroMin: -1,
        anthroMax: Param.ndsi.anthroMax.max + 1,
        bioMin: Param.ndsi.bioMin.min - 1,
        bioMax: Param.ndsi.bioMax.max + 1,
      }));
      // specJsons.push(mockSpecCreateJson(Type.RMS, {
      //   // TODO
      // }));

      const requests = specJsons.map(json => chai.request(app)
        .put('/specs')
        .set('Content-Type', 'application/json')
        .send(json));
      const responses = await Promise.all(requests);

      responses.forEach((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.all.keys('message');
        expect(res.body.message).to.be.a('string');
      });
    });

    it('It should PUT a Spec (new)', async () => {
      const specs = [];
      specs.push(nextMockSpec(Type.ACI));
      specs.push(nextMockSpec(Type.ADI));
      specs.push(nextMockSpec(Type.AEI));
      specs.push(nextMockSpec(Type.BI));
      specs.push(nextMockSpec(Type.NDSI));
      // specs.push(nextMockSpec(Type.RMS)); // TODO

      const specJsons = specs.map(spec => getJsonFromMockSpec(spec));

      const requests = specJsons.map(json => chai.request(app)
        .put('/specs')
        .set('Content-Type', 'application/json')
        .send(json));
      const responses = await Promise.all(requests);

      responses.forEach((res, index) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.all.keys(getSpecKeys(specs[index].type));
        expect(ObjectId(res.body.specId).toString()).to.equal(
          res.body.specId, // Check whether it's a valid ObjectId
        );
        expect(res.body.type).to.equal(specs[index].type);
        expect(getParamsFromSpec(res.body)).to.eql(
          getParamsFromSpec(specs[index]),
        );
      });
    });

    it('It should PUT a Spec (existing)', async () => {
      const spec = nextMockSpec(Type.AEI);
      const specJson = getJsonFromMockSpec(spec);

      await Spec.create(spec);

      const res = await chai.request(app)
        .put('/specs')
        .set('Content-Type', 'application/json')
        .send(specJson);

      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys(getSpecKeys(spec.type));
      expect(res.body.specId).to.equal(spec.id);
      expect(res.body.type).to.equal(spec.type);
      expect(getParamsFromSpec(res.body)).to.eql(
        getParamsFromSpec(spec),
      );
    });

    it('It should PUT a Spec (default params)', async () => {
      const specs = [];
      specs.push(mockSpec(nextMockObjectId(), Type.ACI, {}));
      specs.push(mockSpec(nextMockObjectId(), Type.ADI, {}));
      specs.push(mockSpec(nextMockObjectId(), Type.AEI, {}));
      specs.push(mockSpec(nextMockObjectId(), Type.BI, {}));
      specs.push(mockSpec(nextMockObjectId(), Type.NDSI, {}));
      // specs.push(mockSpec(nextMockObjectId(), Type.RMS, {})); // TODO

      const specJsons = specs.map(spec => getJsonFromMockSpec(spec));

      const requests = specJsons.map(json => chai.request(app)
        .put('/specs')
        .set('Content-Type', 'application/json')
        .send(json));
      const responses = await Promise.all(requests);

      responses.forEach((res, index) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.all.keys(getSpecKeys(specs[index].type));
        expect(res.body.type).to.equal(specs[index].type);
        expect(getParamsFromSpec(res.body)).to.eql(
          getParamsFromSpec(specs[index]),
        );
      });
    });
  });

  describe('/GET Spec', () => {
    it('It should fail to GET a Spec (not found)', async () => {
      const res = await chai.request(app)
        .get(`/specs/${nextMockObjectId()}`);

      expect(res).to.have.status(404);
      expect(res.body).to.have.all.keys('message');
      expect(res.body.message).to.be.a('string');
    });

    it('It should GET a Spec (found)', async () => {
      const spec = nextMockSpec(Type.AEI);

      await Spec.create(spec);

      const res = await chai.request(app)
        .get(`/specs/${spec.id}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys(getSpecKeys(spec.type));
      expect(res.body.specId).to.equal(spec.id);
      expect(res.body.type).to.equal(spec.type);
      expect(getParamsFromSpec(res.body)).to.eql(
        getParamsFromSpec(spec),
      );
    });
  });

  describe('/GET all Specs', () => {
    it('It should GET all the Specs (none)', async () => {
      const res = await chai.request(app)
        .get('/specs');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys(['count', 'specs']);
      expect(res.body.count).to.be.equal(0);
      expect(res.body.specs).to.be.an('array');
      expect(res.body.specs).to.be.empty;
    });

    it('It should GET all the Specs (many)', async () => {
      const specs = [];
      specs.push(nextMockSpec(Type.ACI));
      specs.push(nextMockSpec(Type.ADI));
      specs.push(nextMockSpec(Type.AEI));
      specs.push(nextMockSpec(Type.BI));
      specs.push(nextMockSpec(Type.NDSI));
      // specs.push(nextMockSpec(Type.RMS)); // TODO

      await Spec.insertMany(specs);

      const res = await chai.request(app)
        .get('/specs');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys(['count', 'specs']);
      expect(res.body.count).to.be.equal(specs.length);
      expect(res.body.specs).to.be.an('array');
      expect(res.body.specs).to.have.lengthOf(specs.length);
      res.body.specs.forEach((spec, index) => {
        expect(spec).to.have.all.keys(getSpecKeys(specs[index].type));
        expect(spec.specId).to.equal(specs[index].id);
        expect(spec.type).to.equal(specs[index].type);
        expect(getParamsFromSpec(spec)).to.eql(
          getParamsFromSpec(specs[index]),
        );
      });
    });
  });

  describe('/DELETE Spec', () => {
    it('It should DELETE a Spec (not found)', async () => {
      const res = await chai.request(app)
        .delete(`/specs/${nextMockObjectId()}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('success', 'message');
      expect(res.body.success).to.be.a('boolean');
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.be.a('string');
    });

    it('It should DELETE a Spec (found)', async () => {
      const spec = nextMockSpec(Type.AEI);
      Spec.create(spec);

      const res = await chai.request(app)
        .delete(`/specs/${spec.id}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys('success', 'message');
      expect(res.body.success).to.be.a('boolean');
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.be.a('string');
    });
  });
});
