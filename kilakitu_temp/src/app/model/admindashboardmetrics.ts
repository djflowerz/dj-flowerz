import {PropertyMetrics} from "./propertyMetrics";
import {TenantMetrics} from "./tenantMetrics";

export interface Admindashboardmetrics {
    propertyMetrics: PropertyMetrics[];
    tenantMetrics: TenantMetrics[];
}
