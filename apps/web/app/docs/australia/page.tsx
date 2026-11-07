import type { Metadata } from "next";
import { DocPage, DocSection } from "@/components/marketing/doc-page";

export const metadata: Metadata = {
  title: "Australian setup — RestaurantOS AU",
  description: "Australian defaults, import guidance and deployment limits for RestaurantOS AU.",
};

export default function AustraliaGuidePage() {
  return (
    <DocPage title="Australian setup" updated="7 November 2026">
      <DocSection heading="New installs">
        <p>
          New restaurants default to AUD, Australia/Sydney, country AU, inclusive menu pricing and the AU GST label. Existing restaurant settings are preserved during upgrades. The 30-table demonstration floor is sample data only.
        </p>
      </DocSection>
      <DocSection heading="GST treatment">
        <p>
          Menu tax rates are configured per item. Dine-in food and hot takeaway food are generally taxable where the supply conditions apply, while other foods may be GST-free or taxable depending on product and supply context. Confirm each live menu item, combo, receipt and report with a registered Australian tax professional. The preset is not tax advice or compliance certification.
        </p>
        <p>
          See the <a className="text-primary underline underline-offset-4" href="https://www.ato.gov.au/api/public/content/0-d5b4612a-b7f7-4fea-b46b-e5adf657055c">ATO GST-free food guidance</a> and its <a className="text-primary underline underline-offset-4" href="https://www.ato.gov.au/law/view/pdf?DocID=GII%2FGSTIIFL1%2FNAT%2FATO%2F00001&amp;PiT=20230628000001&amp;filename=law%2Fview%2Fpdf%2Fpbr%2Fgstii-fl1c4.pdf">Detailed Food List</a>.
        </p>
      </DocSection>
      <DocSection heading="Menu and ingredient imports">
        <p>
          Use Menu → Import for the downloadable CSV template and preview. The source tree also includes example files in <code>docs/examples</code>. Example prices, tax rates, ingredient costs and opening quantities are not restaurant data. Review every row before importing.
        </p>
      </DocSection>
      <DocSection heading="Preview status">
        <p>
          This is an Australian adaptation of NodeDR OrderRestro, not an official NodeDR release. It has passed typecheck, unit tests and build in this environment; a full Docker/PostgreSQL deployment and live workflow acceptance have not been completed here. Review the project&rsquo;s AU_IMPLEMENTATION_STATUS.md before using real restaurant data.
        </p>
      </DocSection>
    </DocPage>
  );
}
