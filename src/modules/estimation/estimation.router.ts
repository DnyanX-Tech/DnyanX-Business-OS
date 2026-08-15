import { Router, Request, Response, type IRouter } from 'express';

export const estimationRouter: IRouter = Router();

interface CivilEstimateInput {
  plotAreaSqFt: number;
  floors?: number;
  qualityTier?: 'Standard' | 'Premium' | 'Luxury';
  ratePerSqFt?: number;
}

/**
 * Thumb rules for Civil Construction Estimation in India:
 * - Built-up area = plotArea * floors
 * - Cement: ~0.4 bags per sq.ft of built-up area
 * - Steel: ~3.5 kg per sq.ft
 * - Sand (Fine Aggregate): ~1.8 sq.ft / 0.06 tons per sq.ft
 * - Aggregate (Coarse): ~1.35 sq.ft per sq.ft
 * - Bricks: ~20 bricks per sq.ft
 * - Approx Base Construction Cost: ₹1,650/sq.ft (Standard), ₹2,100/sq.ft (Premium)
 */
estimationRouter.post('/civil', (req: Request, res: Response): void => {
  try {
    const {
      plotAreaSqFt = 1000,
      floors = 1,
      qualityTier = 'Standard',
      ratePerSqFt = qualityTier === 'Premium' ? 2100 : qualityTier === 'Luxury' ? 2600 : 1650,
    }: CivilEstimateInput = req.body;

    const builtUpArea = plotAreaSqFt * floors;
    const totalEstimatedCost = builtUpArea * ratePerSqFt;

    // Material calculations
    const cementBags = Math.round(builtUpArea * 0.4);
    const cementCost = cementBags * 380; // ₹380/bag avg

    const steelKg = Math.round(builtUpArea * 3.5);
    const steelCost = steelKg * 68; // ₹68/kg avg

    const sandTons = Math.round(builtUpArea * 0.055);
    const sandCost = sandTons * 1600;

    const bricksCount = Math.round(builtUpArea * 18);
    const bricksCost = bricksCount * 9.5; // ₹9.5/brick avg

    const laborCost = Math.round(totalEstimatedCost * 0.28); // 28% labor avg
    const finishesAndPlumbingCost = totalEstimatedCost - (cementCost + steelCost + sandCost + bricksCost + laborCost);

    res.status(200).json({
      success: true,
      builtUpAreaSqFt: builtUpArea,
      floors,
      qualityTier,
      ratePerSqFt,
      totalEstimatedCost,
      breakdown: {
        cement: { quantity: `${cementBags} Bags (५० kg)`, approxCost: cementCost },
        steel: { quantity: `${steelKg} kg (${(steelKg / 1000).toFixed(2)} MT)`, approxCost: steelCost },
        sand: { quantity: `${sandTons} Brass/Tons`, approxCost: sandCost },
        bricks: { quantity: `${bricksCount.toLocaleString('en-IN')} Pcs (विटा)`, approxCost: bricksCost },
        labor: { description: 'RCC, Masonry, Bar Bending & Plaster', approxCost: laborCost },
        finishing: { description: 'Tiles, Electrical, Paint & Plumbing', approxCost: finishesAndPlumbingCost > 0 ? finishesAndPlumbingCost : 100000 },
      },
      shareableSummaryMarathi: `🏗️ *बांधकाम अंदाजपत्रक (Civil Estimate)*\n📐 एकूण क्षेत्रफळ: ${builtUpArea} Sq.Ft (G+${floors - 1})\n💰 अंदाजे एकूण खर्च: ₹${totalEstimatedCost.toLocaleString('en-IN')}\n\n🧱 *साहित्य अंदाजे:*\n• सिमेंट: ${cementBags} गोण्या\n• स्टील: ${steelKg} kg\n• विटा: ${bricksCount} नग\n• वाळू: ${sandTons} ब्रास\n\n_DnyanX Civil Estimator द्वारे प्रमाणित_`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
