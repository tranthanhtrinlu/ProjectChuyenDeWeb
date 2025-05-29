package vn.trijava.springrest.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.turkraft.springfilter.boot.Filter;
import com.turkraft.springfilter.builder.FilterBuilder;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import jakarta.validation.Valid;
import vn.trijava.springrest.domain.Company;
import vn.trijava.springrest.domain.Job;
import vn.trijava.springrest.domain.Resume;
import vn.trijava.springrest.domain.User;
import vn.trijava.springrest.domain.response.ResultPaginationDTO;
import vn.trijava.springrest.domain.response.resume.ResCreateResumeDTO;
import vn.trijava.springrest.domain.response.resume.ResFetchResumeDTO;
import vn.trijava.springrest.domain.response.resume.ResUpdateResumeDTO;
import vn.trijava.springrest.service.ResumeService;
import vn.trijava.springrest.service.UserService;
import vn.trijava.springrest.util.SecurityUtil;
import vn.trijava.springrest.util.annotation.ApiMessage;
import vn.trijava.springrest.util.error.IdInvalidException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1")
public class ResumeController {

    private final ResumeService resumeService;
    private final UserService userService;

    private final FilterBuilder filterBuilder;
    private final FilterSpecificationConverter filterSpecificationConverter;

    public ResumeController(
            ResumeService resumeService,
            UserService userService,
            FilterBuilder filterBuilder,
            FilterSpecificationConverter filterSpecificationConverter) {
        this.resumeService = resumeService;
        this.userService = userService;
        this.filterBuilder = filterBuilder;
        this.filterSpecificationConverter = filterSpecificationConverter;
    }

    @PostMapping("/resumes")
    @ApiMessage("Create a resume")
    public ResponseEntity<ResCreateResumeDTO> create(@Valid @RequestBody Resume resume) throws IdInvalidException {
        // check id exists
        boolean isIdExist = this.resumeService.checkResumeExistByUserAndJob(resume);
        if (!isIdExist) {
            throw new IdInvalidException("User id/Job id không tồn tại");
        }

        // create new resume
        return ResponseEntity.status(HttpStatus.CREATED).body(this.resumeService.create(resume));
    }

    @PutMapping("/resumes")
    @ApiMessage("Update a resume")
    public ResponseEntity<ResUpdateResumeDTO> update(@RequestBody Resume resume) throws IdInvalidException {
        // check id exist
        Optional<Resume> reqResumeOptional = this.resumeService.fetchById(resume.getId());
        if (reqResumeOptional.isEmpty()) {
            throw new IdInvalidException("Resume với id = " + resume.getId() + " không tồn tại");
        }

        Resume reqResume = reqResumeOptional.get();
        reqResume.setStatus(resume.getStatus());

        return ResponseEntity.ok().body(this.resumeService.update(reqResume));
    }

    @DeleteMapping("/resumes/{id}")
    @ApiMessage("Delete a resume by id")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) throws IdInvalidException {
        Optional<Resume> reqResumeOptional = this.resumeService.fetchById(id);
        if (reqResumeOptional.isEmpty()) {
            throw new IdInvalidException("Resume với id = " + id + " không tồn tại");
        }

        this.resumeService.delete(id);
        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/resumes/{id}")
    @ApiMessage("Fetch a resume by id")
    public ResponseEntity<ResFetchResumeDTO> fetchById(@PathVariable("id") long id) throws IdInvalidException {
        Optional<Resume> reqResumeOptional = this.resumeService.fetchById(id);
        if (reqResumeOptional.isEmpty()) {
            throw new IdInvalidException("Resume với id = " + id + " không tồn tại");
        }

        return ResponseEntity.ok().body(this.resumeService.getResume(reqResumeOptional.get()));
    }

//    @GetMapping("/resumes")
//    @ApiMessage("Fetch all resume with paginate")
//    public ResponseEntity<ResultPaginationDTO> fetchAll(
//            @Filter Specification<Resume> spec,
//            Pageable pageable) {
//
//        List<Long> arrJobIds = null;
//        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true
//                ? SecurityUtil.getCurrentUserLogin().get()
//                : "";
//        User currentUser = this.userService.handleGetUserByUsername(email);
//        if (currentUser != null) {
//            Company userCompany = currentUser.getCompany();
//            if (userCompany != null) {
//                List<Job> companyJobs = userCompany.getJobs();
//                if (companyJobs != null && companyJobs.size() > 0) {
//                    arrJobIds = companyJobs.stream().map(x -> x.getId())
//                            .collect(Collectors.toList());
//                }
//            }
//        }
//
//        Specification<Resume> jobInSpec = filterSpecificationConverter.convert(filterBuilder.field("job")
//                .in(filterBuilder.input(arrJobIds)).get());
//
//        Specification<Resume> finalSpec = jobInSpec.and(spec);
//
//        return ResponseEntity.ok().body(this.resumeService.fetchAllResume(finalSpec, pageable));
//    }

    @GetMapping("/resumes")
    @ApiMessage("Fetch all resume with paginate")
    public ResponseEntity<ResultPaginationDTO> fetchAll(
            @Filter Specification<Resume> spec,
            Pageable pageable) {

        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        User currentUser = this.userService.handleGetUserByUsername(email);

        Specification<Resume> finalSpec = spec;

        if (currentUser != null) {
            Company userCompany = currentUser.getCompany();
            if (userCompany != null) {
                List<Job> companyJobs = userCompany.getJobs();
                if (companyJobs != null && companyJobs.size() > 0) {
                    List<Long> arrJobIds = companyJobs.stream().map(x -> x.getId())
                            .collect(Collectors.toList());

                    Specification<Resume> jobInSpec = filterSpecificationConverter.convert(
                            filterBuilder.field("job").in(filterBuilder.input(arrJobIds)).get());

                    finalSpec = jobInSpec.and(spec);
                } else {
                    // Company không có jobs nào, trả về empty result
                    finalSpec = (root, query, criteriaBuilder) -> criteriaBuilder.disjunction();
                }
            }
            // Nếu user không thuộc company nào
            // Kiểm tra xem có phải là SUPER_ADMIN không
            if (currentUser.getRole() != null && "SUPER_ADMIN".equals(currentUser.getRole().getName())) {
                // SUPER_ADMIN có thể xem tất cả resumes
                finalSpec = spec;
            } else {
                // User thường không thuộc company nào thì không xem được resume nào
                finalSpec = (root, query, criteriaBuilder) -> criteriaBuilder.disjunction();
            }
        }

        return ResponseEntity.ok().body(this.resumeService.fetchAllResume(finalSpec, pageable));
    }

    @PostMapping("/resumes/by-user")
    @ApiMessage("Get list resumes by user")
    public ResponseEntity<ResultPaginationDTO> fetchResumeByUser(Pageable pageable) {

        return ResponseEntity.ok().body(this.resumeService.fetchResumeByUser(pageable));
    }
}
